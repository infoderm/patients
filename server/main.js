import "@babel/polyfill";
import { Meteor } from 'meteor/meteor';

import { Patients } from '../imports/api/patients.js';
import { Drugs } from '../imports/api/drugs.js';
import { Consultations } from '../imports/api/consultations.js';
import { Insurances , insurances } from '../imports/api/insurances.js';
import { Doctors , doctors } from '../imports/api/doctors.js';

Meteor.startup(() => {

  // drop all indexes (if the collection is not empty)
  if (Patients.find().count() !== 0) Patients.rawCollection().dropIndexes();
  if (Drugs.find().count() !== 0) Drugs.rawCollection().dropIndexes();
  if (Consultations.find().count() !== 0) Consultations.rawCollection().dropIndexes();
  if (Insurances.find().count() !== 0) Insurances.rawCollection().dropIndexes();
  if (Doctors.find().count() !== 0) Doctors.rawCollection().dropIndexes();

  // code to run on server at startup
  Patients.rawCollection().createIndex({
    owner: 1,
    niss: 1,
  },{
    background: true,
  });

  Patients.rawCollection().createIndex({
    owner: 1,
    lastname: 1,
  },{
    background: true,
  });

  Patients.rawCollection().createIndex({
    owner: 1,
    doctor: 1,
  },{
    background: true,
  });

  Patients.rawCollection().createIndex({
    owner: 1,
    insurance: 1,
  },{
    background: true,
  });

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

  Insurances.remove({});

  Patients.find().map( ( { owner , insurance } ) => insurance && insurances.add(owner, insurance));

  Insurances.rawCollection().createIndex({
    owner: 1,
    name: 1,
  },{
    unique: true,
    background: true,
  });

  Doctors.remove({});

  Patients.find().map( ( { owner , doctor } ) => doctor && doctors.add(owner, doctor));

  Doctors.rawCollection().createIndex({
    owner: 1,
    name: 1,
  },{
    unique: true,
    background: true,
  });

});
