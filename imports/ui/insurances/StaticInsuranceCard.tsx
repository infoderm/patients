import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';

import StaticTagCard from '../tags/StaticTagCard';

import StaticPatientChip from '../patients/StaticPatientChip';

import {useInsuranceStats} from '../../api/insurances';
import {usePatientsInsuredBy} from '../../api/patients';
import {myEncodeURIComponent} from '../../client/uri';
import InsuranceDeletionDialog from './InsuranceDeletionDialog';
import InsuranceRenamingDialog from './InsuranceRenamingDialog';

const styles = (theme) =>
	createStyles({
		avatar: {
			color: '#fff',
			backgroundColor: red[500],
		},
		patientChip: {
			marginRight: theme.spacing(1),
			backgroundColor: '#aaa',
			fontWeight: 'normal',
			color: '#fff',
		},
	});

const useStyles = makeStyles(styles);

const LoadedTagCard = ({item}) => {
	const classes = useStyles();

	const {result} = useInsuranceStats(item.name);
	const {count} = result ?? {};
	const {results: patients} = usePatientsInsuredBy(item.name, {
		fields: StaticPatientChip.projection,
		limit: 1,
	});
	const subheader = count === undefined ? '...' : `assure ${count} patients`;
	const content =
		patients === undefined ? (
			<>...</>
		) : (
			<div>
				{patients.map((patient) => (
					<StaticPatientChip
						key={patient._id}
						patient={patient}
						className={classes.patientChip}
					/>
				))}
				{count > patients.length && (
					<Chip label={`+ ${count - patients.length}`} />
				)}
			</div>
		);
	return (
		<StaticTagCard
			tag={item}
			subheader={subheader}
			content={content}
			url={(name) => `/insurance/${myEncodeURIComponent(name)}`}
			avatar={<Avatar className={classes.avatar}>In</Avatar>}
			DeletionDialog={InsuranceDeletionDialog}
			RenamingDialog={InsuranceRenamingDialog}
		/>
	);
};

const StaticInsuranceCard = ({item, loading = false}) => {
	if (loading) return null;
	if (item === undefined) return null;

	return <LoadedTagCard item={item} />;
};

StaticInsuranceCard.propTypes = {
	item: PropTypes.object,
	loading: PropTypes.bool,
};

export default StaticInsuranceCard;
