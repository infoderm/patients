import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import PatientGridItem from './PatientGridItem';
import PatientsPage from './PatientsPage';
import NewPatientCard from './NewPatientCard';

const StaticPatientsListPropTypes = {
	className: PropTypes.string,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	loading: PropTypes.bool,
	patients: PropTypes.array.isRequired,
	root: PropTypes.string.isRequired,
	Card: PropTypes.elementType,
};

type Props = InferProps<typeof StaticPatientsListPropTypes>;

const StaticPatientsList = ({
	page,
	perpage,
	loading = false,
	patients,
	root,
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
			<Paginator
				disabled={loading}
				page={page}
				end={patients.length < perpage}
				root={root}
			/>
		</>
	);
};

StaticPatientsList.projection = PatientsPage.projection;

StaticPatientsList.propTypes = StaticPatientsListPropTypes;

export default StaticPatientsList;
