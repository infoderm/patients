import React from 'react';

import {styled} from '@mui/material/styles';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import {green} from '@mui/material/colors';

import debounce from 'debounce';
import StaticTagCard from '../tags/StaticTagCard';

import StaticPatientChip, {
	projection as StaticPatientChipProjection,
} from '../patients/StaticPatientChip';

import call from '../../api/endpoint/call';
import {type AllergyDocument} from '../../api/collection/allergies';
import {useAllergyStats, usePatientsHavingAllergy} from '../../api/allergies';

import ColorPicker from '../input/ColorPicker';

import {myEncodeURIComponent} from '../../util/uri';
import changeColor from '../../api/endpoint/allergies/changeColor';
import AllergyRenamingDialog from './AllergyRenamingDialog';
import AllergyDeletionDialog from './AllergyDeletionDialog';

const AllergyAvatar = styled(Avatar)({
	color: '#fff',
	backgroundColor: green[500],
});

const GreyPatientChip = styled(StaticPatientChip)(({theme}) => ({
	marginRight: theme.spacing(1),
	backgroundColor: '#aaa',
	fontWeight: 'normal',
	color: '#fff',
}));

type StaticAllergyCardProps = {
	loading?: boolean;
	found?: boolean;
	item: AllergyDocument;
};

const StaticAllergyCard = React.forwardRef<any, StaticAllergyCardProps>(
	({loading = false, found = true, item}, ref) => {
		if (item === undefined) return null;

		return (
			<LoadedTagCard ref={ref} loading={loading} found={found} item={item} />
		);
	},
);

type LoadedTagCardProps = {
	loading: boolean;
	found: boolean;
	item: AllergyDocument;
};

const LoadedTagCard = React.forwardRef<any, LoadedTagCardProps>(
	({loading, found, item}, ref) => {
		const {result} = useAllergyStats(item.name);
		const {count} = result ?? {};
		const {results: patients} = usePatientsHavingAllergy(item.name, {
			fields: StaticPatientChipProjection,
			limit: 1,
		});

		const onChange = async (color: string) => {
			if (color !== item.color) {
				try {
					await call(changeColor, item._id, color);
					console.log(`Changed color of allergy ${item._id} to ${color}`);
				} catch (error: unknown) {
					console.error(error);
				}
			}
		};

		const subheader = count === undefined ? '...' : `affecte ${count} patients`;

		const content =
			patients === undefined ? (
				<>...</>
			) : (
				<div>
					{patients.map((patient) => (
						<GreyPatientChip key={patient._id} patient={patient} />
					))}
					{count !== undefined && count > patients.length && (
						<Chip
							label={
								patients.length === 0
									? `${count}`
									: `+ ${count - patients.length}`
							}
						/>
					)}
				</div>
			);

		return (
			<StaticTagCard
				ref={ref}
				loading={loading}
				found={found}
				tag={item}
				url={(name: string) => `/allergy/${myEncodeURIComponent(name)}`}
				subheader={subheader}
				content={content}
				actions={
					<ColorPicker
						defaultValue={item.color || '#e0e0e0'}
						onChange={debounce(onChange, 1000)}
					/>
				}
				avatar={<AllergyAvatar>Al</AllergyAvatar>}
				DeletionDialog={AllergyDeletionDialog}
				RenamingDialog={AllergyRenamingDialog}
			/>
		);
	},
);

export default StaticAllergyCard;
