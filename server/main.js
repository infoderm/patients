import "@babel/polyfill";
import { Meteor } from 'meteor/meteor';
import { ObjectId } from 'meteor/mongo';

import dateParseISO from 'date-fns/parseISO';

import { Settings } from '../imports/api/settings.js';
import { Patients } from '../imports/api/patients.js';
import { Drugs } from '../imports/api/drugs.js';
import { Consultations } from '../imports/api/consultations.js';
import { appointments } from '../imports/api/appointments.js';
import { Insurances , insurances } from '../imports/api/insurances.js';
import { Doctors , doctors } from '../imports/api/doctors.js';
import { Allergies , allergies } from '../imports/api/allergies.js';
import { Books , books } from '../imports/api/books.js';
import { Documents , documents } from '../imports/api/documents.js';

Meteor.startup(() => {

  // code to run on server at startup

  const collections = [
    Settings ,
    Patients ,
    Drugs ,
    Consultations ,
    Insurances ,
    Doctors ,
    Allergies ,
    Books ,
    Documents ,
  ] ;

  // drop all indexes (if the collection is not empty)
  for ( const collection of collections ) {
    if (collection.find().count() !== 0) collection.rawCollection().dropIndexes();
  }

  // delete all generated book entries
  Books.remove({});

  // reshape doctor, insurance, allergies to arrays
  Patients.rawCollection().find().snapshot().forEach( patient => {

    if ( patient.doctor !== undefined ) {
      if (patient.doctor) patient.doctors = [ patient.doctor ] ;
      delete patient.doctor;
    }

    if ( patient.insurance !== undefined ) {
      if (patient.insurance) patient.insurances = [ patient.insurance ] ;
      delete patient.insurance;
    }

    if ( typeof patient.allergies === 'string' ) {
      const allergies = patient.allergies.split(/[,\n\r]/).map(s => s.trim()).filter(x=>!!x);
      if (allergies.length > 0) patient.allergies = allergies ;
      else delete patient.allergies;
    }
    else if ( ! ( patient.allergies instanceof Array ) ) {
      delete patient.allergies;
    }

    Patients.rawCollection().save(patient);

  } ) ;

  // add .isDone field to consultations
  Consultations.rawCollection().find().snapshot().forEach( consultation => {

    if ( consultation.scheduledAt ) {
      consultation.createdAt = consultation.scheduledAt ;
      consultation.datetime = consultation.scheduledDatetime ;
      consultation.reason = consultation.scheduledReason ;
      delete consultation.scheduledAt;
      delete consultation.scheduledDatetime;
      delete consultation.scheduledReason;
    }

    if ( consultation.isDone !== false ) consultation.isDone = true ;

    Consultations.rawCollection().save(consultation);

  } ) ;

  // move book/2020/0 consultations of value 20 after march 15 to book/2020/covid
  // and set payment method to third-party
  Consultations.rawCollection().find().snapshot().forEach( consultation => {

    if (
      consultation.book === '0' &&
      consultation.datetime >= dateParseISO('2020-03-15') &&
      consultation.datetime < dateParseISO('2020-06-01') &&
      consultation.price === 20
    ) {
      consultation.book = 'covid' ;
      consultation.payment_method = 'third-party' ;
    }

    Consultations.rawCollection().save(consultation);

  } ) ;

  // create indexes

  const createSimpleIndex = ( collection , field ) => collection.rawCollection().createIndex({
    owner: 1,
    [field]: 1,
  },{
    background: true,
  });

  createSimpleIndex(Patients, 'niss');
  createSimpleIndex(Patients, 'lastname');
  createSimpleIndex(Patients, 'doctors');
  createSimpleIndex(Patients, 'insurances');
  createSimpleIndex(Patients, 'allergies');
  createSimpleIndex(Documents, 'createdAt');


  const createSimpleUniqueIndex = ( collection , field ) => collection.rawCollection().createIndex({
    owner: 1,
    [field]: 1,
  },{
    unique: true,
    background: true,
  });

  createSimpleUniqueIndex(Settings, 'key');
  createSimpleUniqueIndex(Insurances, 'name');
  createSimpleUniqueIndex(Doctors, 'name');
  createSimpleUniqueIndex(Allergies, 'name');
  createSimpleUniqueIndex(Books, 'name');

  Books.rawCollection().createIndex({
    owner: 1,
    fiscalYear: 1,
    bookNumber: 1,
  }, {
    background: true,
  });

  createSimpleUniqueIndex(Drugs, 'mppcv');

  Drugs.rawCollection().createIndex({
    '$**': 'text',
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    owner: 1,
    datetime: 1,
    isDone: 1,
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    owner: 1,
    patientId: 1,
    datetime: 1,
    isDone: 1,
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    owner: 1,
    book: 1,
    datetime: 1,
    isDone: 1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    owner: 1,
    patientId: 1,
    datetime: 1,
    status: 1,
    lastVersion: 1,
    deleted: 1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    owner: 1,
    patientId: 1,
    createdAt: 1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    owner: 1,
    createdAt: 1,
    parsed: 1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    owner: 1,
    createdAt: 1,
    encoding: 1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    source: 'hashed',
  },{
    background: true,
  });

  // recreate all generated entries
  const generateTags = (parent, child, key) => parent.find().map(
    ( { owner , [key]: tags } ) => tags && tags.forEach(tag=>child.add(owner, tag))
  );

  generateTags(Patients, insurances, 'insurances');
  generateTags(Patients, doctors, 'doctors');
  generateTags(Patients, allergies, 'allergies');

  Consultations.find().map(
    ( { owner , datetime , book , isDone } ) => {
      if (isDone && datetime && book) {
        books.add(owner, books.name(datetime, book));
      }
    }
  );

  // reparse all documents
  Documents.rawCollection().find().snapshot().forEach(

    Meteor.bindEnvironment(({_id, owner, createdAt, patientId, format, source, parsed}) => {
      if (!_id.toHexString && parsed) return;

      const array = (new TextEncoder()).encode(source);

      const document = {
        patientId,
        format,
        array,
      } ;

      const entries = documents.sanitize(document);

      for ( const entry of entries ) {
        if (!entry.parsed) return ;
        const inserted = Documents.insert({
            ...entry,
            createdAt,
            owner,
        });
        console.debug('Inserted new parsed document', inserted);
      }

      console.debug('Removing old document', _id);
      Documents.rawCollection().remove({_id});

    })

  );

  // remove duplicate documents
  const documentsIndex = {};
  Documents.rawCollection().find().snapshot().forEach(
    Meteor.bindEnvironment(({_id, owner, patientId, source}) => {
      if ( documentsIndex[owner] === undefined ) documentsIndex[owner] = {};
      const keep = documentsIndex[owner][source];
      if (!keep) {
        documentsIndex[owner][source] = { _id, patientId } ;
        return;
      }
      if (!keep.patientId) {
        console.debug('Removing previously kept duplicate document', keep._id);
        Documents.rawCollection().remove({_id: keep._id});
        documentsIndex[owner][source] = {_id, patientId};
      }
      else {
        console.debug('Removing current duplicate document', _id);
        Documents.rawCollection().remove({_id});
      }
    })
  );

  // add missing deleted flag
  Documents.rawCollection().find().snapshot().forEach(
    Meteor.bindEnvironment(({_id, deleted}) => {
      if (deleted !== true && deleted !== false) Documents.update(_id, { $set: { deleted: false } } ) ;
    })
  );

  // add missing lastVersion flag
  Documents.rawCollection().find().snapshot().forEach(
    Meteor.bindEnvironment(({owner, parsed, identifier, reference, datetime}) => {
      documents.updateLastVersionFlags(owner, { parsed , identifier , reference , datetime }) ;
    })
  );

});
