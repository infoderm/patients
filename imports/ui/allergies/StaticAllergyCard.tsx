import React, {useMemo} from 'react';

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

import {myEncodeURIComponent} from '../../lib/uri';
import changeColor from '../../api/endpoint/allergies/changeColor';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';

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

type StaticAllergyCardProps =
	| {loading: true; found: any; item: any}
	| {loading: false; found: false; item: any}
	| {loading: false; found: true; item: AllergyDocument};

const StaticAllergyCard = React.forwardRef<any, StaticAllergyCardProps>(
	({loading = false, found = true, item}, ref) => {
		if (item === undefined) return null;

		return (
			<LoadedTagCard ref={ref} loading={loading} found={found} item={item} />
		);
	},
);

type LoadedTagCardProps = {
	readonly loading: boolean;
	readonly found: boolean;
	readonly item: AllergyDocument;
};

const LoadedTagCard = React.forwardRef<any, LoadedTagCardProps>(
	({loading, found, item}, ref) => {
		const {_id, name, color} = item;
		const {result} = useAllergyStats(name);
		const {count} = result ?? {};
		const {results: patients} = usePatientsHavingAllergy(name, {
			fields: StaticPatientChipProjection,
			limit: 1,
		});

		const onChange = useMemo(
			() =>
				debounce(async (newColor: string) => {
					if (newColor !== color) {
						try {
							await call(changeColor, _id, newColor);
							console.log(`Changed color of allergy ${_id} to ${newColor}`);
						} catch (error: unknown) {
							console.error(error);
						}
					}
				}, TIMEOUT_INPUT_DEBOUNCE),
			[_id, color],
		);

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
					<ColorPicker defaultValue={color ?? '#e0e0e0'} onChange={onChange} />
				}
				avatar={<AllergyAvatar>Al</AllergyAvatar>}
				DeletionDialog={AllergyDeletionDialog}
				RenamingDialog={AllergyRenamingDialog}
			/>
		);
	},
);

export default StaticAllergyCard;
