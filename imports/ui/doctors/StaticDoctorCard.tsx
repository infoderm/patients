import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';

import StaticTagCard from '../tags/StaticTagCard';

import StaticPatientChip from '../patients/StaticPatientChip';

import {useDoctorStats} from '../../api/doctors';
import {usePatientsGoingToDoctor} from '../../api/patients';

import {myEncodeURIComponent} from '../../client/uri';
import DoctorRenamingDialog from './DoctorRenamingDialog';
import DoctorDeletionDialog from './DoctorDeletionDialog';

const styles = (theme) =>
	createStyles({
		avatar: {
			color: '#fff',
			backgroundColor: blue[500],
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

	const {result} = useDoctorStats(item.name);
	const {count} = result ?? {};
	const {results: patients} = usePatientsGoingToDoctor(item.name, {
		fields: StaticPatientChip.projection,
		limit: 1,
	});

	const subheader = count === undefined ? '...' : `soigne ${count} patients`;
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
			url={(name: string) => `/doctor/${myEncodeURIComponent(name)}`}
			subheader={subheader}
			content={content}
			avatar={<Avatar className={classes.avatar}>Dr</Avatar>}
			DeletionDialog={DoctorDeletionDialog}
			RenamingDialog={DoctorRenamingDialog}
		/>
	);
};

const StaticDoctorCard = ({item, loading = false}) => {
	if (loading) return null;
	if (item === undefined) return null;

	return <LoadedTagCard item={item} />;
};

StaticDoctorCard.propTypes = {
	item: PropTypes.object,
	loading: PropTypes.bool,
};

export default StaticDoctorCard;
