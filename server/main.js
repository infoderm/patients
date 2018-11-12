import "@babel/polyfill";
import { Meteor } from 'meteor/meteor';

import { Patients } from '../imports/api/patients.js';
import { Drugs } from '../imports/api/drugs.js';
import { Consultations } from '../imports/api/consultations.js';
import { Insurances , insurances } from '../imports/api/insurances.js';
import { Doctors , doctors } from '../imports/api/doctors.js';
import { Allergies , allergies } from '../imports/api/allergies.js';
import { Books , books } from '../imports/api/books.js';

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
  ] ;

  // drop all indexes (if the collection is not empty)
  for ( const collection of collections ) {
    if (collection.find().count() !== 0) collection.rawCollection().dropIndexes();
  }

  // delete all generated entries
  Insurances.remove({});
  Doctors.remove({});
  Allergies.remove({});
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

    if ( patient.allergies instanceof String ) {
      if (patient.allergies) patient.allergies = [ patient.allergies ] ;
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


  const createSimpleUniqueIndex = ( collection , field ) => collection.rawCollection().createIndex({
    owner: 1,
    [field]: 1,
  },{
    unique: true,
    background: true,
  });

  createSimpleUniqueIndex(Insurances, 'name')
  createSimpleUniqueIndex(Doctors, 'name')
  createSimpleUniqueIndex(Allergies, 'name')
  createSimpleUniqueIndex(Books, 'name')

  Drugs.rawCollection().createIndex({
    owner: 1,
    mppcv: 1,
  },{
    unique: true,
    background: true,
  });

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

  // recreate all generated entries
  const generateTags = (parent, child, key) => parent.find().map(
    ( { owner , [key]: tags } ) => tags && tags.forEach(tag=>child.add(owner, tag))
  );

  generateTags(Patients, insurances, 'insurances');
  generateTags(Patients, doctors, 'doctors');
  generateTags(Patients, allergies, 'allergies');

  Consultations.find().map( ( { owner , datetime , book } ) => datetime && book && books.add(owner, books.name(datetime, book)));


});
