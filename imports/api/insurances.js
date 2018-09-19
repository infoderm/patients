import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Patients } from './patients.js';

export const Insurances = new Mongo.Collection('insurances');

if (Meteor.isServer) {
  Meteor.publish('insurances', function () {
    return Insurances.find({ owner: this.userId });
  });
}

export const insurances = {

  add: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
      owner,
      name,
    };

    return Insurances.upsert( fields, { $set: fields } ) ;

  } ,

  remove: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
      owner,
      name,
    };

    return Insurances.remove( fields ) ;

  } ,

} ;

Meteor.methods({

  'insurances.rename'(insuranceId, newname){

    check(insuranceId, String);
    check(newname, String);

    const insurance = Insurances.findOne(insuranceId);
    const owner = insurance.owner;

    if (owner !== this.userId) throw new Meteor.Error('not-authorized');

    const oldname = insurance.name;
    newname = newname.trim();

    Patients.update(
      { owner , insurance : oldname } ,
      { $set : { insurance : newname } } ,
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

    Insurances.remove(insuranceId);
    return Insurances.upsert( newfields, { $set: newfields } ) ;

  },

  'insurances.delete'(insuranceId){

    check(insuranceId, String);

    const insurance = Insurances.findOne(insuranceId);
    const owner = insurance.owner;

    if (owner !== this.userId) throw new Meteor.Error('not-authorized');

    Patients.update(
      { owner , insurance: insurance.name } ,
      { $set : { insurance : '' } } ,
      { multi: true }
    );
    return Insurances.remove(insuranceId);
  },

});
