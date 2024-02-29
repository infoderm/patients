import React from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import {DatePicker} from '@mui/x-date-pickers';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import isValid from 'date-fns/isValid';

import {type PatientDocument} from '../../api/collection/patients';
import virtualFields from '../../api/patients/virtualFields';
import useBirthdatePickerProps from '../birthdate/useBirthdatePickerProps';
import CancelButton from '../button/CancelButton';
import withLazyOpening from '../modal/withLazyOpening';
import useCall from '../action/useCall';

import patientsUpdate from '../../api/endpoint/patients/update';
import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

import GenericStaticPatientCard from './GenericStaticPatientCard';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly patient: PatientDocument;
};

const PatientDeathDateEditionDialog = ({open, onClose, patient}: Props) => {
	const {
		deathdateModifiedAt: deathdateModifiedAtInit,
		deathdateLegal: deathdateLegalInit,
	} = virtualFields(patient);
	const [deathdateModifiedAt, setDeathdateModifiedAt] =
		useStateWithInitOverride<Date | undefined>(deathdateModifiedAtInit);
	const [deathdateLegal, setDeathdateLegal] = useStateWithInitOverride<
		Date | undefined
	>(deathdateLegalInit);
	const birthdatePickerProps = useBirthdatePickerProps();
	const {isDead} = virtualFields({
		...patient,
		deathdateModifiedAt,
		deathdate: deathdateLegal,
	});
	const [call, {pending}] = useCall();
	const handleSave = async () => {
		const changes = {
			deathdateModifiedAt,
			deathdate: deathdateModifiedAt === undefined ? undefined : deathdateLegal,
		};
		await call(patientsUpdate, patient._id, changes);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				Edit patient {patient.firstname} {patient.lastname} death date
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Marking the patient as dead will exclude them from search results with
					default settings. All records will be kept.
				</DialogContentText>
				<Grid container spacing={3} sx={{marginTop: 1}}>
					<Grid item xs={12}>
						<GenericStaticPatientCard patient={patient} />
					</Grid>
					<Grid item xs={12}>
						<FormControl disabled={pending}>
							<FormLabel>Status</FormLabel>
							<RadioGroup
								row
								name="status"
								value={isDead ? 'dead' : 'alive'}
								onChange={({
									target: {value},
								}: React.ChangeEvent<HTMLInputElement>) => {
									if (value === 'dead') {
										setDeathdateModifiedAt(new Date());
									} else {
										setDeathdateModifiedAt(undefined);
									}
								}}
							>
								<FormControlLabel
									value="alive"
									control={<Radio />}
									label="This patient is alive"
								/>
								<FormControlLabel
									value="dead"
									control={<Radio />}
									label="This patient is dead"
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<DatePicker<Date>
							{...birthdatePickerProps}
							disabled={!isDead || pending}
							label="Death date"
							slotProps={{
								textField: {
									margin: 'normal',
									InputLabelProps: {shrink: true},
								},
							}}
							value={isDead ? deathdateLegal ?? null : null}
							onChange={(date) => {
								if (isValid(date)) {
									setDeathdateLegal(date!);
								}
							}}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending} onClick={onClose} />
				<LoadingButton
					loading={pending}
					disabled={deathdateModifiedAt === deathdateModifiedAtInit}
					color="primary"
					endIcon={<SaveIcon />}
					loadingPosition="end"
					onClick={handleSave}
				>
					Save
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(PatientDeathDateEditionDialog);
