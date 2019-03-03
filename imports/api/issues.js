import { Meteor } from 'meteor/meteor';

import { Patients } from './patients.js';
import { Consultations } from './consultations.js';

if (Meteor.isServer) {

	Meteor.publish('issues/patients-missing-a-gender', function () {
		return Patients.find(
			{
				owner: this.userId ,
				$or: [
					{ sex : null } ,
					{ sex : '' } ,
				] ,
			}
		);
	});

	Meteor.publish('issues/consultations-missing-a-book', function () {
		return Consultations.find({
				owner: this.userId ,
				$or: [
					{ book : null } ,
					{ book : '' } ,
				] ,
			}
		);
	});

	Meteor.publish('issues/patients-missing-a-birthdate', function () {
		return Patients.find({
				owner: this.userId ,
				$or: [
					{ birthdate : null } ,
					{ birthdate : '' } ,
				] ,
			}
		);
	});

	Meteor.publish('issues/consultations-missing-a-price', function () {
		return Consultations.find({
			owner: this.userId ,
			//$or: [
				//{ price : { $not: { $type: 1 } } } ,
				//{ price : NaN } ,
			//] ,
		});
	});

}
