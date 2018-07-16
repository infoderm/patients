import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Doctors = new Mongo.Collection('doctors');

if (Meteor.isServer) {
	Meteor.publish('doctors', function () {
		return Doctors.find({ owner: this.userId });
	});
}

export const doctors = {} ;

if (Meteor.isServer) {
  doctors.add = ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
        owner,
        name,
    };

    return Doctors.upsert( fields, { $set: fields } ) ;

  } ;

  doctors.remove = ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
        owner,
        name,
    };

    return Doctors.remove( fields ) ;

  } ;

}
