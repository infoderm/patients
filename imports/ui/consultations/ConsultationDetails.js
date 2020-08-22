import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {Consultations} from '../../api/consultations.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import ConsultationCard from './ConsultationCard.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	}
}));

const ConsultationDetails = ({loading, consultation}) => {
	const classes = useStyles();

	if (loading) {
		return <Loading />;
	}

	if (!consultation) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return (
		<div className={classes.container}>
			<ConsultationCard defaultExpanded consultation={consultation} />
		</div>
	);
};

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('consultation', _id);
	if (handle.ready()) {
		const consultation = Consultations.findOne(_id);
		return {loading: false, consultation};
	}

	return {loading: true};
})(ConsultationDetails);
