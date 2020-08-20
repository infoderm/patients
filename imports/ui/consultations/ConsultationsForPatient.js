import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddCommentIcon from '@material-ui/icons/AddComment';

import {Patients} from '../../api/patients.js';
// import {Consultations} from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import ConsultationsPager from './ConsultationsPager.js';

const useStyles = makeStyles((theme) => ({
	createButton: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(21)
	}
}));

const ConsultationsForPatient = (props) => {
	const classes = useStyles();

	const {patientId, loading, patient, page, perpage} = props;

	if (loading) {
		return <Loading />;
	}

	if (!patient) {
		return <NoContent>Patient not found.</NoContent>;
	}

	const query = {
		patientId,
		isDone: true
	};

	const sort = {datetime: -1};

	return (
		<>
			<ConsultationsPager
				root={`/patient/${patientId}/consultations`}
				page={page}
				perpage={perpage}
				query={query}
				sort={sort}
				itemProps={{patientChip: false}}
				defaultExpandedFirst={page === 1}
			/>
			<Fab
				className={classes.createButton}
				color="primary"
				component={Link}
				to={`/new/consultation/for/${patientId}`}
			>
				<AddCommentIcon />
			</Fab>
		</>
	);
};

export default withTracker(({patientId}) => {
	const patientHandle = Meteor.subscribe('patient', patientId);

	const loading = !patientHandle.ready();

	const patient = loading ? null : Patients.findOne(patientId);

	return {
		loading,
		patient
	};
})(ConsultationsForPatient);
