import React from 'react';

import Grid from '@material-ui/core/Grid';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import PatientGridItem from './PatientGridItem';
import PatientsPage from './PatientsPage';
import NewPatientCard from './NewPatientCard';

interface Props {
	className?: string;
	page: number;
	perpage: number;
	loading?: boolean;
	patients: unknown[];
	Card?: React.ElementType;
}

const StaticPatientsList = ({
	page,
	perpage,
	loading = false,
	patients,
	Card,
	...rest
}: Props) => {
	if (loading && patients.length === 0) return <Loading />;

	const style = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : undefined,
	};

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
			<Paginator disabled={loading} end={patients.length < perpage} />
		</>
	);
};

StaticPatientsList.projection = PatientsPage.projection;

export default StaticPatientsList;
