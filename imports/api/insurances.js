import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Insurances = new Mongo.Collection('insurances');

if (Meteor.isServer) {
	Meteor.publish('insurances', function () {
		return Insurances.find({ owner: this.userId });
	});
}

export const insurances = {} ;

if (Meteor.isServer) {
  insurances.add = ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
        owner,
        name,
    };

    return Insurances.upsert( fields, { $set: fields } ) ;

  } ;

  insurances.remove = ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
        owner,
        name,
    };

    return Insurances.remove( fields ) ;

  } ;

}
