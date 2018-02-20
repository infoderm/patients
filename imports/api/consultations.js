import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Consultations = new Mongo.Collection('consultations');

if (Meteor.isServer) {
	Meteor.publish('consultations', function () {
		return Consultations.find({ owner: this.userId });
	});
	Meteor.publish('consultation', function (_id) {
		check(_id, String);
		return Consultations.find({ owner: this.userId , _id });
	});
	Meteor.publish('patient.consultations', function (patientId) {
		check(patientId, String);
		return Consultations.find({ owner: this.userId , patientId: patientId });
	});
}

Meteor.methods({

	'consultations.insert'({ datetime , report , patientId }) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		check(datetime, Date);
		check(report, String);
		check(patientId, String);

		const createdAt = new Date();
		const owner = this.userId;
		const username = Meteor.users.findOne(this.userId).username;

		return Consultations.insert({

			datetime ,
			report ,
			patientId ,

			createdAt ,
			owner ,
			username ,

		});

	},

	'consultations.remove'(consultationId){
		check(consultationId, String);
		const consultation = Consultations.findOne(consultationId);
		if (consultation.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Consultations.remove(consultationId);
	},

});
