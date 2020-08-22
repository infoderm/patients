import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js';

import PatientsPage from './PatientsPage.js';
import PatientGridItem from '../patients/PatientGridItem.js';
import NewPatientCard from './NewPatientCard.js';

export default function StaticPatientsList({
	page,
	perpage,
	loading,
	patients,
	root,
	Card,
	...rest
}) {
	if (loading && patients.length === 0) return <Loading />;

	const style = {
		transition: 'opacity 200ms ease-out'
	};
	if (loading) style.opacity = 0.4;

	return (
		<>
			<div style={style} {...rest}>
				{patients.length > 0 ? (
					<PatientsPage
						patients={patients}
						Card={Card}
						NewCard={NewPatientCard}
					/>
				) : page === 1 ? (
					<div>
						<NoContent>No patients match the current query.</NoContent>
						<Grid container spacing={3}>
							<Grid item sm="auto" md="auto" lg={3} xl={4} />
							<PatientGridItem Card={NewPatientCard} />
							<Grid item sm="auto" md="auto" lg={3} xl={4} />
						</Grid>
					</div>
				) : (
					<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
				)}
			</div>
			<Paginator
				disabled={loading}
				page={page}
				end={patients.length < perpage}
				root={root}
			/>
		</>
	);
}

StaticPatientsList.projection = PatientsPage.projection;

StaticPatientsList.defaultProps = {
	loading: false
};

StaticPatientsList.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	loading: PropTypes.bool,
	patients: PropTypes.array.isRequired,
	root: PropTypes.string.isRequired,
	Card: PropTypes.elementType
};
