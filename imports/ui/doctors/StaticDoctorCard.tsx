import React from 'react';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';

import StaticTagCard from '../tags/StaticTagCard';

import StaticPatientChip, {
	projection as StaticPatientChipProjection,
} from '../patients/StaticPatientChip';

import {useDoctorStats, usePatientsGoingToDoctor} from '../../api/doctors';

import {myEncodeURIComponent} from '../../util/uri';
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

interface LoadedTagCardProps {
	loading: boolean;
	found: boolean;
	item: {name: string};
}

const LoadedTagCard = ({loading, found, item}: LoadedTagCardProps) => {
	const classes = useStyles();

	const {result} = useDoctorStats(item.name);
	const {count} = result ?? {};
	const {results: patients} = usePatientsGoingToDoctor(item.name, {
		fields: StaticPatientChipProjection,
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
			loading={loading}
			found={found}
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

interface StaticDoctorCardProps {
	item?: {name: string};
	loading?: boolean;
	found?: boolean;
}

const StaticDoctorCard = ({
	item,
	loading = false,
	found = true,
}: StaticDoctorCardProps) => {
	if (item === undefined) return null;

	return <LoadedTagCard loading={loading} found={found} item={item} />;
};

export default StaticDoctorCard;
