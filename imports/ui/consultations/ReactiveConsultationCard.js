import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import StaticPatientChip from '../patients/StaticPatientChip.js';
import ConsultationPaymentDialog from './ConsultationPaymentDialog.js';
import ConsultationDebtSettlementDialog from './ConsultationDebtSettlementDialog.js';
import ConsultationDeletionDialog from './ConsultationDeletionDialog.js';

import {Patients} from '../../api/patients.js';
import StaticConsultationCard from './StaticConsultationCard.js';

export default withTracker(({consultation}) => {
	const _id = consultation.patientId;
	if (_id === undefined) {
		return {loadingPatient: true};
	}

	const options = {
		fields: {
			...StaticPatientChip.projection,
			...ConsultationPaymentDialog.projection,
			...ConsultationDebtSettlementDialog.projection,
			...ConsultationDeletionDialog.projection
		}
	};
	const handle = Meteor.subscribe('patient', _id, options);
	if (handle.ready()) {
		const patient = Patients.findOne(_id, options);
		return {loadingPatient: false, patient};
	}

	return {loadingPatient: true};
})(StaticConsultationCard);
