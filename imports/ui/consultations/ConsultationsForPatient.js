import React from 'react';

import {Link} from 'react-router-dom';

import AddCommentIcon from '@material-ui/icons/AddComment';

import usePatient from '../patients/usePatient.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import FixedFab from '../button/FixedFab.js';

import ConsultationsPager from './ConsultationsPager.js';

const ConsultationsForPatient = (props) => {
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
			<FixedFab
				col={4}
				color="primary"
				component={Link}
				to={`/new/consultation/for/${patientId}`}
				tooltip="Start new consultation"
			>
				<AddCommentIcon />
			</FixedFab>
		</>
	);
};

export default ConsultationsForPatient;
