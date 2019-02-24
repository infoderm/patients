import "@babel/polyfill";
import { Meteor } from 'meteor/meteor';

import { Patients } from '../imports/api/patients.js';
import { Drugs } from '../imports/api/drugs.js';
import { Consultations } from '../imports/api/consultations.js';
import { Insurances , insurances } from '../imports/api/insurances.js';
import { Doctors , doctors } from '../imports/api/doctors.js';
import { Allergies , allergies } from '../imports/api/allergies.js';
import { Books , books } from '../imports/api/books.js';
import { Documents , documents } from '../imports/api/documents.js';

Meteor.startup(() => {

  // code to run on server at startup

  const collections = [
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

  createSimpleUniqueIndex(Insurances, 'name');
  createSimpleUniqueIndex(Doctors, 'name');
  createSimpleUniqueIndex(Allergies, 'name');
  createSimpleUniqueIndex(Books, 'name');

  createSimpleUniqueIndex(Drugs, 'mppcv');

  Drugs.rawCollection().createIndex({
    '$**': 'text',
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    owner: 1,
    datetime: -1,
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    owner: 1,
    patientId: 1,
    datetime: -1,
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    owner: 1,
    book: 1,
    datetime: 1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    owner: 1,
    patientId: 1,
    datetime: -1,
  },{
    background: true,
  });

  Documents.rawCollection().createIndex({
    owner: 1,
    patientId: 1,
    createdAt: -1,
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

  Consultations.find().map( ( { owner , datetime , book } ) => datetime && book && books.add(owner, books.name(datetime, book)));

  // reparse all documents
  Documents.rawCollection().find().snapshot().forEach( ({_id, owner, createdAt, patientId, format, source, parsed}) => {

    //if (parsed) return;

    const document = {
      patientId,
      format,
      source,
    } ;

    const entries = documents.sanitize(document);

    for ( const entry of entries ) {
      if (!entry.parsed) return ;
      Documents.insert({
          ...entry,
          createdAt,
          owner,
      });
    }

    Documents.remove(_id);

  });


});
