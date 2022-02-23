import React, {useEffect} from 'react';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';

import {makeStyles, createStyles} from '@mui/styles';

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';

import DatePicker from '@mui/lab/DatePicker';

import isValid from 'date-fns/isValid';
import Button from '@mui/material/Button';

import {parseOneAddress, ParsedMailbox} from 'email-addresses';

import TextField from '../input/TextField';

import {dataURL as pngDataURL} from '../../util/png';

import {useInsurancesFind} from '../../api/insurances';
import {useDoctorsFind} from '../../api/doctors';
import {useAllergiesFind} from '../../api/allergies';

import eidFormatBirthdate from '../../api/eidFormatBirthdate';
import useNoShowsForPatient from '../../api/useNoShowsForPatient';

import {PatientDocument, Email} from '../../api/collection/patients';

import {useDateFormat, useDateFormatAge} from '../../i18n/datetime';

import useBirthdatePickerProps from '../birthdate/useBirthdatePickerProps';

import usePrompt from '../navigation/usePrompt';
import NoContent from '../navigation/NoContent';

import SetPicker from '../input/SetPicker';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import ColorizedTextarea from '../input/ColorizedTextarea';

import ReactiveAllergyChip from '../allergies/ReactiveAllergyChip';
import ReactiveDoctorChip from '../doctors/ReactiveDoctorChip';
import ReactiveInsuranceChip from '../insurances/ReactiveInsuranceChip';

import useImportantStringsDict from '../settings/useImportantStringsDict';
import virtualFields from '../../api/patients/virtualFields';
import PatientDeletionDialog from './PatientDeletionDialog';
import usePatientPersonalInformationReducer from './usePatientPersonalInformationReducer';
import PatientPersonalInformationButtonsStatic from './PatientPersonalInformationButtonsStatic';

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

interface PatientPersonalInformationStaticProps {
	patient: PatientDocument;
	loading?: boolean;
}

const noSuggestions = () => ({results: []});

const PatientPersonalInformationStatic = (
	props: PatientPersonalInformationStaticProps,
) => {
	const importantStringsDict = useImportantStringsDict();

	const [state, dispatch] = usePatientPersonalInformationReducer(props.patient);

	const {editing, dirty, deleting, patient} = state;
	const {loading = false} = props;

	useEffect(() => {
		if (patient !== props.patient) {
			dispatch({type: 'init', payload: props.patient});
		}
	}, [JSON.stringify(props.patient)]);

	usePrompt(
		'You are trying to leave the page while in edit mode. Are you sure you want to continue?',
		dirty,
	);

	const classes = useStyles();

	const {value: reifiedNoShows} = useNoShowsForPatient(props.patient._id);

	const localizeBirthdate = useDateFormat('PPP');
	const localizeAge = useDateFormatAge();
	const birthdatePickerProps = useBirthdatePickerProps();

	if (loading) {
		return <NoContent>Loading...</NoContent>;
	}

	if (!patient) {
		return <NoContent>Patient not found.</NoContent>;
	}

	const placeholder = !editing ? '?' : 'Write some information here';

	const minRows = 8;
	const maxRows = 100;

	const update =
		(key: string, f = (v) => v) =>
		(e) => {
			dispatch({type: 'update', key, value: f(e.target.value)});
		};

	const updateList = (key: string) =>
		update(key, (v) =>
			list(map(({name, displayName}) => ({name, displayName}), v)),
		);

	const {
		birthdate: _birthdate,
		deathdateLegal,
		deathdate,
		isDead,
	} = virtualFields(patient);
	const displayedAge = localizeAge(_birthdate, deathdate);

	const hardCodedNoShows: number = patient.noshow || 0;
	const totalNoShow =
		hardCodedNoShows +
		(typeof reifiedNoShows === 'number' ? reifiedNoShows : 0);

	return (
		<Paper className={classes.root}>
			<Grid container spacing={3}>
				<Grid item sm={4} md={2} className={classes.left}>
					<div>
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
					</div>
					{!patient.birthdate ? null : (
						<Typography variant="h5">
							{localizeBirthdate(_birthdate)}
						</Typography>
					)}
					{!patient.birthdate ? null : (
						<Typography variant="h5">{displayedAge}</Typography>
					)}
					{(editing || isDead) && (
						<Button
							disabled={!editing}
							color={isDead ? 'secondary' : 'primary'}
							startIcon={isDead ? <HeartBrokenIcon /> : <MonitorHeartIcon />}
							onClick={() => {
								dispatch({
									type: 'update',
									key: 'deathdateModifiedAt',
									value: isDead ? null : new Date(),
								});
							}}
						>
							{`Décédé${patient.sex === 'female' ? 'e' : ''}${
								isDead ? '' : ' ?'
							}`}
						</Button>
					)}
					{editing && isDead && (
						<DatePicker<Date>
							{...birthdatePickerProps}
							label="Death date"
							value={deathdateLegal}
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
										key: 'deathdate',
										value: date,
									});
								}
							}}
						/>
					)}
					{!totalNoShow ? null : (
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
										<TextField
											select
											fullWidth
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
										<DatePicker<Date>
											{...birthdatePickerProps}
											label="Birth date"
											value={_birthdate}
											disabled={!editing}
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
									minRows={minRows}
									maxRows={maxRows}
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
									minRows={minRows}
									maxRows={maxRows}
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
									createNewItem={(name) => ({name, displayName: name})}
									useSuggestions={makeSubstringSuggestions(
										useAllergiesFind,
										patient.allergies?.map((x) => x.name),
										'name',
										undefined,
										{displayName: 1},
									)}
									readOnly={!editing}
									TextFieldProps={{
										label: 'Allergies',
										margin: 'normal',
									}}
									Chip={ReactiveAllergyChip}
									chipProps={allergyChipProps}
									value={(patient.allergies || []) as Array<{name: string}>}
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
									rows={3}
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
									createNewItem={(name) => ({name, displayName: name})}
									useSuggestions={makeSubstringSuggestions(
										useDoctorsFind,
										patient.doctors?.map((x) => x.name),
										'name',
										undefined,
										{displayName: 1},
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
									value={(patient.doctors || []) as Array<{name: string}>}
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
									createNewItem={(name) => ({name, displayName: name})}
									useSuggestions={makeSubstringSuggestions(
										useInsurancesFind,
										patient.insurances?.map((x) => x.name),
										'name',
										undefined,
										{displayName: 1},
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
									value={(patient.insurances || []) as Array<{name: string}>}
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
									minRows={2}
									maxRows={maxRows}
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
									fullWidth
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
							<Grid item xs={12}>
								<SetPicker
									readOnly={!editing}
									useSuggestions={noSuggestions}
									itemToKey={(email) => email.address}
									itemToString={(email) => email.address}
									inputValidation={(inputString) => {
										const parsed = parseOneAddress(
											inputString,
										) as ParsedMailbox | null;
										if (parsed === null) return {state: 0};
										const {domain} = parsed;
										return domain.includes('.') ? {state: 1} : {state: 0};
									}}
									createNewItem={(inputString) => {
										const parsed = parseOneAddress(
											inputString,
										) as ParsedMailbox | null;
										if (parsed === null) return undefined;
										const {name, address, local, domain} = parsed;
										if (!domain.includes('.')) return undefined;
										if (name === null) return {address, local, domain};
										return {
											address,
											local,
											domain,
											name,
										};
									}}
									TextFieldProps={{
										fullWidth: true,
										label: 'e-mail addresses',
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
									value={(patient.email ?? []) as Email[]}
									placeholder={placeholder}
									onChange={update('email')}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Grid>
			<PatientPersonalInformationButtonsStatic
				editing={editing}
				dirty={dirty}
				dispatch={dispatch}
				patient={patient}
				patientInit={props.patient}
			/>
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
