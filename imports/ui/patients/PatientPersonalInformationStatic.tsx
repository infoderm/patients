import React, {useReducer, useEffect, useMemo} from 'react';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import {makeStyles, createStyles} from '@mui/styles';
import {useSnackbar} from 'notistack';

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';

import DatePicker from '@mui/lab/MobileDatePicker';

import isValid from 'date-fns/isValid';
import TextField from '../input/TextField';
import FixedFab from '../button/FixedFab';

import {dataURL as pngDataURL} from '../../util/png';

import {useInsurancesFind} from '../../api/insurances';
import {useDoctorsFind} from '../../api/doctors';
import {useAllergiesFind} from '../../api/allergies';
import {useSetting} from '../settings/hooks';

import eidParseBirthdate from '../../api/eidParseBirthdate';
import eidFormatBirthdate from '../../api/eidFormatBirthdate';
import useNoShowsForPatient from '../../api/useNoShowsForPatient';

import call from '../../api/endpoint/call';
import patientsUpdate from '../../api/endpoint/patients/update';
import patientsAttach from '../../api/endpoint/patients/attach';

import {
	// makeAnyIndex,
	makeRegExpIndex,
} from '../../api/string';

import {
	useDateFormat,
	useDateFormatAge,
	useDateMask,
} from '../../i18n/datetime';

import usePrompt from '../navigation/usePrompt';

import SetPicker from '../input/SetPicker';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import ColorizedTextarea from '../input/ColorizedTextarea';

import ReactiveAllergyChip from '../allergies/ReactiveAllergyChip';
import ReactiveDoctorChip from '../doctors/ReactiveDoctorChip';
import ReactiveInsuranceChip from '../insurances/ReactiveInsuranceChip';

import ManageConsultationsForPatientButton from '../consultations/ManageConsultationsForPatientButton';
import AttachFileButton from '../attachments/AttachFileButton';

import useUniqueId from '../hooks/useUniqueId';
import PatientDeletionDialog from './PatientDeletionDialog';

const allergyChipProps = {
	avatar: <Avatar>Al</Avatar>,
};

const doctorChipProps = {
	avatar: <Avatar>Dr</Avatar>,
};

const insuranceChipProps = {
	avatar: <Avatar>In</Avatar>,
};

const styles = (theme) =>
	createStyles({
		root: {
			padding: theme.spacing(3),
			paddingBottom: theme.spacing(5),
		},
		photoPlaceHolder: {
			display: 'inline-flex',
			fontSize: '4rem',
			margin: 0,
			width: 140,
			height: 200,
			alignItems: 'center',
			justifyContent: 'center',
			color: '#fff',
			backgroundColor: '#999',
			verticalAlign: 'top',
			marginBottom: theme.spacing(2),
		},
		left: {
			textAlign: 'center',
		},
		photo: {
			width: 140,
			height: 200,
			verticalAlign: 'top',
			marginBottom: theme.spacing(2),
		},
		formControl: {
			overflow: 'auto',
			'& input, & div': {
				color: 'black !important',
			},
		},
		setPicker: {
			height: '100%',
		},
		multiline: {
			height: '100%',
			overflow: 'auto',
			'& textarea': {
				color: 'black !important',
			},
		},
		button: {
			margin: theme.spacing(1),
		},
		problem: {
			color: 'red',
		},
		noShowsAdornment: {
			color: '#999',
		},
	});

const useStyles = makeStyles(styles);

const initialState = {
	patient: undefined,
	editing: false,
	dirty: false,
	deleting: false,
};

/**
 * reducer.
 *
 * @param {Object} state
 * @param {{type: string, key?: string, value?: any, payload?: any}} action
 */
const reducer = (state, action) => {
	switch (action.type) {
		case 'update':
			return {
				...state,
				patient: {...state.patient, [action.key]: action.value},
				dirty: true,
			};
		case 'editing':
			return {...state, editing: true};
		case 'not-editing':
			return {...state, editing: false, dirty: false};
		case 'deleting':
			return {...state, deleting: true};
		case 'not-deleting':
			return {...state, deleting: false};
		case 'init':
			return {
				...state,
				editing: false,
				dirty: false,
				deleting: false,
				patient: action.payload,
			};
		default:
			throw new Error(`Unknown action type ${action.type}.`);
	}
};

interface PatientPersonalInformationStaticProps {
	patient: any;
	loading?: boolean;
}

const PatientPersonalInformationStatic = (
	props: PatientPersonalInformationStaticProps,
) => {
	const {value: importantStrings} = useSetting('important-strings');

	const importantStringsDict = useMemo(
		() =>
			// return makeAnyIndex(importantStrings);
			makeRegExpIndex(importantStrings),
		[importantStrings],
	);

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		dispatch({type: 'init', payload: props.patient});
	}, [JSON.stringify(props.patient)]);

	const {editing, dirty, deleting, patient} = state;
	const {loading = false} = props;

	usePrompt(
		'You are trying to leave the page while in edit mode. Are you sure you want to continue?',
		dirty,
	);

	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const classes = useStyles();

	const saveDetails = async (_event) => {
		const key = enqueueSnackbar('Processing...', {
			variant: 'info',
			persist: true,
		});

		try {
			await call(patientsUpdate, patient._id, patient);
			closeSnackbar(key);
			const message = `Patient #${patient._id} updated.`;
			console.log(message);
			enqueueSnackbar(message, {variant: 'success'});
			dispatch({type: 'not-editing'});
		} catch (error: unknown) {
			closeSnackbar(key);
			const message = error instanceof Error ? error.message : 'unknown error';
			enqueueSnackbar(message, {variant: 'error'});
			console.error({error});
		}
	};

	const {value: reifiedNoShows} = useNoShowsForPatient(props.patient._id);

	const localizeBirthdate = useDateFormat('PPP');
	const localizeAge = useDateFormatAge();
	const localizedDateMask = useDateMask();

	const componentId = useUniqueId('patient-personal-information');

	const attachFileButtonId = `${componentId}-attach-file-button`;

	const nnInputId = `${componentId}-input-nn`;
	const lastnameInputId = `${componentId}-input-lastname`;
	const firstnameInputId = `${componentId}-input-firstname`;
	const sexInputId = `${componentId}-input-sex`;
	const birthdateInputId = `${componentId}-input-birthdate`;
	const antecedentsInputId = `${componentId}-input-antecedents`;
	const ongoingInputId = `${componentId}-input-ongoing`;
	const streetandnumberInputId = `${componentId}-input-streetandnumber`;
	const zipInputId = `${componentId}-input-zip`;
	const municipalityInputId = `${componentId}-input-municipality`;
	const phoneInputId = `${componentId}-input-phone`;
	const aboutInputId = `${componentId}-input-about`;
	const noshowInputId = `${componentId}-input-noshow`;

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!patient) {
		return <div>Patient not found.</div>;
	}

	const placeholder = !editing ? '?' : 'Write some information here';

	const minRows = 8;
	const maxRows = 100;

	const update =
		(key, f = (v) => v) =>
		(e) => {
			dispatch({type: 'update', key, value: f(e.target.value)});
		};

	const updateList = (key) => update(key, (v) => list(map((x) => x.name, v)));

	const _birthdate = eidParseBirthdate(patient.birthdate);
	const displayedAge = localizeAge(_birthdate);

	const hardCodedNoShows: number = patient.noshow || 0;
	const totalNoShow =
		hardCodedNoShows +
		(typeof reifiedNoShows === 'number' ? reifiedNoShows : 0);

	return (
		<Paper className={classes.root}>
			<Grid container spacing={3}>
				<Grid item sm={4} md={2} className={classes.left}>
					{patient.photo ? (
						<img
							className={classes.photo}
							src={pngDataURL(patient.photo)}
							title={`${patient.firstname} ${patient.lastname}`}
						/>
					) : (
						<div className={classes.photoPlaceHolder}>
							{patient.firstname ? patient.firstname[0] : '?'}
							{patient.lastname ? patient.lastname[0] : '?'}
						</div>
					)}
					{!patient.birthdate ? (
						''
					) : (
						<Typography variant="h5">
							{localizeBirthdate(_birthdate)}
						</Typography>
					)}
					{!patient.birthdate ? (
						''
					) : (
						<Typography variant="h5">{displayedAge}</Typography>
					)}
					{!totalNoShow ? (
						''
					) : (
						<Typography className={classes.problem} variant="h4">
							PVPP = {totalNoShow}
						</Typography>
					)}
				</Grid>
				<Grid item sm={8} md={10}>
					<form>
						<Grid container spacing={3}>
							{editing && (
								<>
									<Grid item xs={2}>
										<TextField
											fullWidth
											id={nnInputId}
											className={classes.formControl}
											label="NISS"
											value={patient.niss}
											readOnly={!editing}
											margin="normal"
											onChange={update('niss')}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											fullWidth
											id={lastnameInputId}
											className={classes.formControl}
											label="Last name"
											value={patient.lastname}
											readOnly={!editing}
											margin="normal"
											onChange={update('lastname')}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											fullWidth
											id={firstnameInputId}
											className={classes.formControl}
											label="First name"
											value={patient.firstname}
											readOnly={!editing}
											margin="normal"
											onChange={update('firstname')}
										/>
									</Grid>
									<Grid item xs={2}>
										<TextField
											select
											fullWidth
											id={sexInputId}
											label="Sex"
											margin="normal"
											className={classes.formControl}
											value={patient.sex || ''}
											readOnly={!editing}
											onChange={update('sex')}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											<MenuItem value="female">Female</MenuItem>
											<MenuItem value="male">Male</MenuItem>
											<MenuItem value="other">Other</MenuItem>
										</TextField>
									</Grid>
									<Grid item xs={2}>
										<DatePicker
											disabled={!editing}
											mask={localizedDateMask}
											value={_birthdate}
											label="Birth date"
											renderInput={(props) => (
												<TextField
													id={birthdateInputId}
													margin="normal"
													InputLabelProps={{shrink: true}}
													{...props}
												/>
											)}
											onChange={(date) => {
												if (isValid(date)) {
													dispatch({
														type: 'update',
														key: 'birthdate',
														value: eidFormatBirthdate(date),
													});
												}
											}}
										/>
									</Grid>
								</>
							)}
							<Grid item xs={12} md={6}>
								<ColorizedTextarea
									fullWidth
									id={antecedentsInputId}
									readOnly={!editing}
									label="Antécédents"
									placeholder={placeholder}
									rows={minRows}
									rowsMax={maxRows}
									className={classes.multiline}
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										style: {
											height: '100%',
											alignItems: 'start',
										},
									}}
									value={patient.antecedents}
									margin="normal"
									dict={importantStringsDict}
									onChange={update('antecedents')}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<ColorizedTextarea
									fullWidth
									id={ongoingInputId}
									readOnly={!editing}
									label="Traitement en cours"
									placeholder={placeholder}
									rows={minRows}
									rowsMax={maxRows}
									className={classes.multiline}
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										style: {
											height: '100%',
											alignItems: 'start',
										},
									}}
									value={patient.ongoing}
									margin="normal"
									dict={importantStringsDict}
									onChange={update('ongoing')}
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<SetPicker
									withoutToggle
									itemToKey={(x) => x.name}
									itemToString={(x) => x.name}
									createNewItem={(name) => ({name})}
									useSuggestions={makeSubstringSuggestions(
										useAllergiesFind,
										patient.allergies,
									)}
									readOnly={!editing}
									TextFieldProps={{
										label: 'Allergies',
										margin: 'normal',
									}}
									Chip={ReactiveAllergyChip}
									chipProps={allergyChipProps}
									value={
										list(
											map((x) => ({name: x}), patient.allergies || []),
										) as Array<{name: string}>
									}
									placeholder={placeholder}
									onChange={updateList('allergies')}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									multiline
									id={streetandnumberInputId}
									readOnly={!editing}
									label="Rue et Numéro"
									InputLabelProps={{
										shrink: true,
									}}
									placeholder={placeholder}
									rows={1}
									className={classes.multiline}
									value={patient.streetandnumber}
									margin="normal"
									onChange={update('streetandnumber')}
								/>
							</Grid>
							<Grid item xs={12} md={2}>
								<TextField
									fullWidth
									multiline
									id={zipInputId}
									readOnly={!editing}
									label="Code Postal"
									InputLabelProps={{
										shrink: true,
									}}
									placeholder={placeholder}
									rows={1}
									className={classes.multiline}
									value={patient.zip}
									margin="normal"
									onChange={update('zip')}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									multiline
									id={municipalityInputId}
									readOnly={!editing}
									label="Commune"
									InputLabelProps={{
										shrink: true,
									}}
									placeholder={placeholder}
									rows={1}
									className={classes.multiline}
									value={patient.municipality}
									margin="normal"
									onChange={update('municipality')}
								/>
							</Grid>

							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									multiline
									id={phoneInputId}
									readOnly={!editing}
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										style: {
											height: '100%',
											alignItems: 'start',
										},
									}}
									label="Numéro de téléphone"
									placeholder={placeholder}
									rows={1}
									className={classes.multiline}
									value={patient.phone}
									margin="normal"
									onChange={update('phone')}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									withoutToggle
									className={classes.setPicker}
									itemToKey={(x) => x.name}
									itemToString={(x) => x.name}
									createNewItem={(name) => ({name})}
									useSuggestions={makeSubstringSuggestions(
										useDoctorsFind,
										patient.doctors,
									)}
									readOnly={!editing}
									TextFieldProps={{
										fullWidth: true,
										label: 'Médecin Traitant',
										margin: 'normal',
										style: {
											height: '100%',
										},
									}}
									InputProps={{
										style: {
											height: '100%',
										},
									}}
									Chip={ReactiveDoctorChip}
									chipProps={doctorChipProps}
									value={
										list(
											map((x) => ({name: x}), patient.doctors || []),
										) as Array<{name: string}>
									}
									placeholder={placeholder}
									onChange={updateList('doctors')}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									withoutToggle
									className={classes.setPicker}
									itemToKey={(x) => x.name}
									itemToString={(x) => x.name}
									createNewItem={(name) => ({name})}
									useSuggestions={makeSubstringSuggestions(
										useInsurancesFind,
										patient.insurances,
									)}
									readOnly={!editing}
									TextFieldProps={{
										fullWidth: true,
										label: 'Mutuelle',
										margin: 'normal',
										style: {
											height: '100%',
										},
									}}
									InputProps={{
										style: {
											height: '100%',
										},
									}}
									Chip={ReactiveInsuranceChip}
									chipProps={insuranceChipProps}
									value={
										list(
											map((x) => ({name: x}), patient.insurances || []),
										) as Array<{name: string}>
									}
									placeholder={placeholder}
									onChange={updateList('insurances')}
								/>
							</Grid>

							<Grid item xs={9}>
								<ColorizedTextarea
									fullWidth
									id={aboutInputId}
									readOnly={!editing}
									label="About"
									placeholder={placeholder}
									rows={2}
									rowsMax={maxRows}
									className={classes.multiline}
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										style: {
											height: '100%',
											alignItems: 'start',
										},
									}}
									value={patient.about}
									margin="normal"
									dict={importantStringsDict}
									onChange={update('about')}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									id={noshowInputId}
									readOnly={!editing}
									InputProps={{
										startAdornment: reifiedNoShows ? (
											<InputAdornment
												className={classes.noShowsAdornment}
												position="start"
											>
												{reifiedNoShows}+
											</InputAdornment>
										) : undefined,
										style: {
											height: '100%',
										},
									}}
									label="PVPP (sans RDV)"
									placeholder={placeholder}
									className={classes.multiline}
									value={patient.noshow || 0}
									margin="normal"
									onChange={update('noshow', (v) =>
										v === '' ? 0 : Number.parseInt(v, 10),
									)}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Grid>
			{editing ? (
				<>
					<FixedFab
						col={2}
						color="primary"
						disabled={!dirty}
						aria-label="Save"
						onClick={saveDetails}
					>
						<SaveIcon />
					</FixedFab>
					<FixedFab
						col={3}
						color={dirty ? 'secondary' : 'default'}
						aria-label="Undo"
						onClick={() => {
							dispatch({type: 'init', payload: props.patient});
						}}
					>
						<UndoIcon />
					</FixedFab>
				</>
			) : (
				<>
					<FixedFab
						col={2}
						color="default"
						tooltip="Edit info"
						onClick={() => {
							dispatch({type: 'editing'});
						}}
					>
						<EditIcon />
					</FixedFab>
					<AttachFileButton
						id={attachFileButtonId}
						Button={FixedFab}
						col={3}
						color="default"
						endpoint={patientsAttach}
						item={patient._id}
					>
						<AttachFileIcon />
					</AttachFileButton>
					<ManageConsultationsForPatientButton
						Button={FixedFab}
						col={4}
						color="primary"
						patientId={patient._id}
						tooltip="More actions!"
					/>
					<FixedFab
						col={5}
						color="secondary"
						onClick={() => {
							dispatch({type: 'deleting'});
						}}
					>
						<DeleteIcon />
					</FixedFab>
				</>
			)}
			<PatientDeletionDialog
				open={deleting}
				patient={props.patient}
				onClose={() => {
					dispatch({type: 'not-deleting'});
				}}
			/>
		</Paper>
	);
};

export default PatientPersonalInformationStatic;
