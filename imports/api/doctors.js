import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Patients } from './patients.js';

export const Doctors = new Mongo.Collection('doctors');

if (Meteor.isServer) {
  Meteor.publish('doctors', function () {
    return Doctors.find({ owner: this.userId });
  });
}

export const doctors = {

  add: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
      owner,
      name,
    };

    return Doctors.upsert( fields, { $set: fields } ) ;

  } ,

  remove: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
      owner,
      name,
    };

    return Doctors.remove( fields ) ;

  } ,

} ;

Meteor.methods({

  'doctors.rename'(doctorId, newname){

    check(doctorId, String);
    check(newname, String);

    const doctor = Doctors.findOne(doctorId);
    const owner = doctor.owner;

    if (owner !== this.userId) throw new Meteor.Error('not-authorized');

    const oldname = doctor.name;
    newname = newname.trim();

    Patients.update(
      { owner , doctor : oldname } ,
      { $set : { doctor : newname } } ,
      { multi: true }
    );

    const oldfields = {
      owner,
      name: oldname,
    };

    const newfields = {
      owner,
      name: newname,
    };

    Doctors.remove(doctorId);
    return Doctors.upsert( newfields, { $set: newfields } ) ;

  },

  'doctors.delete'(doctorId){

    check(doctorId, String);

    const doctor = Doctors.findOne(doctorId);
    const owner = doctor.owner;

    if (owner !== this.userId) throw new Meteor.Error('not-authorized');

    Patients.update(
      { owner , doctor: doctor.name } ,
      { $set : { doctor : '' } } ,
      { multi: true }
    );
    return Doctors.remove(doctorId);
  },

});
