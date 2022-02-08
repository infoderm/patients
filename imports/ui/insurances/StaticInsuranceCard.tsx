import React from 'react';

import {styled} from '@mui/material/styles';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import red from '@mui/material/colors/red';

import StaticTagCard from '../tags/StaticTagCard';

import StaticPatientChip, {
	projection as StaticPatientChipProjection,
} from '../patients/StaticPatientChip';

import {useInsuranceStats, usePatientsInsuredBy} from '../../api/insurances';
import {myEncodeURIComponent} from '../../util/uri';
import InsuranceDeletionDialog from './InsuranceDeletionDialog';
import InsuranceRenamingDialog from './InsuranceRenamingDialog';

const InsuranceAvatar = styled(Avatar)({
	color: '#fff',
	backgroundColor: red[500],
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
	const {result} = useInsuranceStats(item.name);
	const {count} = result ?? {};
	const {results: patients} = usePatientsInsuredBy(item.name, {
		fields: StaticPatientChipProjection,
		limit: 1,
	});
	const subheader = count === undefined ? '...' : `assure ${count} patients`;
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
			subheader={subheader}
			content={content}
			url={(name) => `/insurance/${myEncodeURIComponent(name)}`}
			avatar={<InsuranceAvatar>In</InsuranceAvatar>}
			DeletionDialog={InsuranceDeletionDialog}
			RenamingDialog={InsuranceRenamingDialog}
		/>
	);
};

interface StaticInsuranceCardProps {
	item?: {name: string};
	loading?: boolean;
	found?: boolean;
}

const StaticInsuranceCard = ({
	item,
	loading = false,
	found = true,
}: StaticInsuranceCardProps) => {
	if (item === undefined) return null;

	return <LoadedTagCard loading={loading} found={found} item={item} />;
};

export default StaticInsuranceCard;
