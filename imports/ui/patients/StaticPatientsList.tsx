import React from 'react';

import Grid from '@mui/material/Grid';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import PatientGridItem from './PatientGridItem';
import PatientsPage from './PatientsPage';
import NewPatientCard from './NewPatientCard';
import type CardPatientProjection from './CardPatientProjection';

type StaticPatientsListProps<
	C,
	T = CardPatientProjection<C> & {_id: string},
> = {
	readonly className?: string;
	readonly page: number;
	readonly perpage: number;
	readonly loading?: boolean;
	readonly patients: T[];
	readonly Card?: React.ElementType;
};

const StaticPatientsList = ({
	page,
	perpage,
	loading = false,
	patients,
	Card,
	...rest
}: StaticPatientsListProps<typeof Card>) => {
	const style = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : undefined,
	};

	return (
		<>
			<div style={style} {...rest}>
				{patients.length === 0 ? (
					loading ? (
						<Loading />
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
					)
				) : (
					<PatientsPage
						patients={patients}
						Card={Card}
						NewCard={NewPatientCard}
					/>
				)}
			</div>
			<Paginator loading={loading} end={patients.length < perpage} />
		</>
	);
};

StaticPatientsList.projection = PatientsPage.projection;

export default StaticPatientsList;
