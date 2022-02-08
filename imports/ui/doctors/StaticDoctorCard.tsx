import React from 'react';

import {styled} from '@mui/material/styles';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import blue from '@mui/material/colors/blue';

import StaticTagCard from '../tags/StaticTagCard';

import StaticPatientChip, {
	projection as StaticPatientChipProjection,
} from '../patients/StaticPatientChip';

import {useDoctorStats, usePatientsGoingToDoctor} from '../../api/doctors';

import {myEncodeURIComponent} from '../../util/uri';
import DoctorRenamingDialog from './DoctorRenamingDialog';
import DoctorDeletionDialog from './DoctorDeletionDialog';

const DoctorAvatar = styled(Avatar)({
	color: '#fff',
	backgroundColor: blue[500],
});

const GreyPatientChip = styled(StaticPatientChip)(({theme}) => ({
	marginRight: theme.spacing(1),
	backgroundColor: '#aaa',
	fontWeight: 'normal',
	color: '#fff',
}));

interface LoadedTagCardProps {
	loading: boolean;
	found: boolean;
	item: {name: string};
}

const LoadedTagCard = ({loading, found, item}: LoadedTagCardProps) => {
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
					<GreyPatientChip key={patient._id} patient={patient} />
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
			avatar={<DoctorAvatar>Dr</DoctorAvatar>}
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
