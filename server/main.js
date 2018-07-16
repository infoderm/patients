import "@babel/polyfill";
import { Meteor } from 'meteor/meteor';

import { Patients } from '../imports/api/patients.js';
import { Drugs } from '../imports/api/drugs.js';
import { Consultations } from '../imports/api/consultations.js';
import { Insurances , insurances } from '../imports/api/insurances.js';

Meteor.startup(() => {
  // code to run on server at startup
  Patients.rawCollection().createIndex({
    niss: 1,
  },{
    unique: true,
    background: true,
  });

  Patients.rawCollection().createIndex({
    lastname: 1,
  },{
    background: true,
  });

  Drugs.rawCollection().createIndex({
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
    datetime: -1,
  },{
    background: true,
  });

  Consultations.rawCollection().createIndex({
    patientId: 1,
    datetime: -1,
  },{
    background: true,
  });

  Insurances.remove({});

  Patients.find().map( ( { owner , insurance } ) => insurance && insurances.add(owner, insurance));

  Insurances.rawCollection().createIndex({
    name: 1,
    owner: 1,
  },{
    unique: true,
    background: true,
  });

});
