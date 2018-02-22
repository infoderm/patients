import { Meteor } from 'meteor/meteor';

import { Patients } from '../imports/api/patients.js';
import { Drugs } from '../imports/api/drugs.js';
import { Consultations } from '../imports/api/consultations.js';

Meteor.startup(() => {
  // code to run on server at startup
  Patients.rawCollection().createIndex({
    niss: 1,
  },{
    unique: true,
    background: true,
  });

  Drugs.rawCollection().createIndex({
    mppcv: 1,
  },{
    unique: true,
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

});
