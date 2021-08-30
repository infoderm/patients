import React, {useReducer, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';

import {Prompt} from 'react-router';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import {makeStyles, createStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {MobileDatePicker as DatePicker} from '@material-ui/pickers';

import isValid from 'date-fns/isValid';
import TextField from '../input/TextField';
import FixedFab from '../button/FixedFab';

import {dataURL as pngDataURL} from '../../util/png';

import {useInsurancesFind} from '../../api/insurances';
import {useDoctorsFind} from '../../api/doctors';
import {useAllergiesFind} from '../../api/allergies';
import {useSetting} from '../../client/settings';

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

import SetPicker from '../input/SetPicker';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import ColorizedTextarea from '../input/ColorizedTextarea';

import ReactiveAllergyChip from '../allergies/ReactiveAllergyChip';
import ReactiveDoctorChip from '../doctors/ReactiveDoctorChip';
import ReactiveInsuranceChip from '../insurances/ReactiveInsuranceChip';

import ManageConsultationsForPatientButton from '../consultations/ManageConsultationsForPatientButton';
import AttachFileButton from '../attachments/AttachFileButton';

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

const PatientPersonalInformation = (props) => {
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
	const {loading} = props;

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
			<Prompt
				when={dirty}
				message="You are trying to leave the page while in edit mode. Are you sure you want to continue?"
			/>
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
											className={classes.formControl}
											label="First name"
											value={patient.firstname}
											readOnly={!editing}
											margin="normal"
											onChange={update('firstname')}
										/>
									</Grid>
									<Grid item xs={2}>
										<FormControl
											fullWidth
											margin="normal"
											className={classes.formControl}
										>
											<InputLabel htmlFor="sex">Sex</InputLabel>
											<Select
												value={patient.sex || ''}
												inputProps={{
													readOnly: !editing,
													name: 'sex',
													id: 'sex',
												}}
												onChange={update('sex')}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												<MenuItem value="female">Female</MenuItem>
												<MenuItem value="male">Male</MenuItem>
												<MenuItem value="other">Other</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={2}>
										<DatePicker
											disabled={!editing}
											mask={localizedDateMask}
											value={_birthdate}
											label="Birth date"
											renderInput={(props) => (
												<TextField
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
									itemToKey={(x) => x._id}
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
									value={list(map((x) => ({name: x}), patient.allergies || []))}
									placeholder={placeholder}
									onChange={updateList('allergies')}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									multiline
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
									itemToKey={(x) => x._id}
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
									value={list(map((x) => ({name: x}), patient.doctors || []))}
									placeholder={placeholder}
									onChange={updateList('doctors')}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									withoutToggle
									className={classes.setPicker}
									itemToKey={(x) => x._id}
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
									value={list(
										map((x) => ({name: x}), patient.insurances || []),
									)}
									placeholder={placeholder}
									onChange={updateList('insurances')}
								/>
							</Grid>

							<Grid item xs={9}>
								<ColorizedTextarea
									fullWidth
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
						onClick={saveDetails}
					>
						<SaveIcon />
					</FixedFab>
					<FixedFab
						col={3}
						color={dirty ? 'secondary' : 'default'}
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
						onClick={() => {
							dispatch({type: 'editing'});
						}}
					>
						<EditIcon />
					</FixedFab>
					<AttachFileButton
						Button={FixedFab}
						col={3}
						color="default"
						method={patientsAttach}
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

PatientPersonalInformation.propTypes = {
	loading: PropTypes.bool,
	patient: PropTypes.object.isRequired,
};

export default PatientPersonalInformation;
