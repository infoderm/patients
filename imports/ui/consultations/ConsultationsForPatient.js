import React from 'react';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddCommentIcon from '@material-ui/icons/AddComment';

import {usePatient} from '../../api/patients.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';

import ConsultationsPager from './ConsultationsPager.js';

const useStyles = makeStyles((theme) => ({
	createButton: computeFixedFabStyle({theme, col: 4})
}));

const ConsultationsForPatient = (props) => {
	const classes = useStyles();

	const {patientId, page, perpage} = props;

	const options = {fields: {_id: 1}};

	const deps = [patientId];

	const {loading, found} = usePatient({}, patientId, options, deps);

	if (loading) {
		return <Loading />;
	}

	if (!found) {
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

export default ConsultationsForPatient;
