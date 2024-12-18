import assert from 'assert';

import React, {useEffect} from 'react';

import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';

import {DatePicker} from '@mui/x-date-pickers';

import isValid from 'date-fns/isValid';
import Button from '@mui/material/Button';

import {parseOneAddress, type ParsedMailbox} from 'email-addresses';
import {styled} from '@mui/material/styles';

import makeStyles from '../styles/makeStyles';

import TextField from '../input/TextField';

import pngDataURL from '../../lib/png/dataURL';

import {useInsurancesFind} from '../../api/insurances';
import {useDoctorsFind} from '../../api/doctors';
import {useAllergiesFind} from '../../api/allergies';

import eidFormatBirthdate from '../../api/eidFormatBirthdate';
import useNoShowsForPatient from '../../api/useNoShowsForPatient';

import {
	type PatientDocument,
	type PatientEmail,
	type PatientTag,
} from '../../api/collection/patients';

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
import useDialog from '../modal/useDialog';
import {emphasize} from '../../lib/color';

import PatientDeletionDialog from './PatientDeletionDialog';
import usePatientPersonalInformationReducer from './usePatientPersonalInformationReducer';
import PatientPersonalInformationButtonsStatic from './PatientPersonalInformationButtonsStatic';
import PatientTagCommentEditionDialog from './PatientTagCommentEditionDialog';
import useObservedPatientsWithChanges from './useObservedPatientsWithChanges';
import useRandom from '../hooks/useRandom';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import {Link} from 'react-router-dom';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import UndoIcon from '@mui/icons-material/Undo';

const useStyles = makeStyles()((theme) => ({
	warning: {
		marginTop: theme.spacing(-3),
		marginBottom: theme.spacing(4),
	},
	inlineIcon: {
		verticalAlign: 'bottom',
	},
	paper: {
		position: 'relative',
	},
	progress: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
	},
	grid: {
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
		color: theme.palette.getContrastText(theme.palette.background.paper),
		backgroundColor: emphasize(theme.palette.background.paper, 0.1),
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
			color: `${theme.palette.text.primary} !important`,
		},
	},
	setPicker: {
		height: '100%',
	},
	multiline: {
		height: '100%',
		overflow: 'auto',
		'& textarea': {
			color: `${theme.palette.text.primary} !important`,
		},
	},
	noShowsAdornment: {
		color: theme.palette.text.secondary,
	},
}));

const ProblemText = styled(Typography)(({theme}) => ({
	color: theme.palette.error.main,
}));

const tagToKey = (x) => x.name;
const tagCreate = (name: string) => ({name, displayName: name});
const tagToNode = (x) => (
	<span>
		{x.displayName} {x.comment ? <b>({x.comment})</b> : null}
	</span>
);
const openUpdateTagCommentDialog = ({
	state,
	kind,
	item,
	dialog,
	readOnly,
	onSave,
}) =>
	readOnly
		? undefined
		: async () => {
				const result = await dialog((resolve) => (
					<PatientTagCommentEditionDialog
						initialValue={item.comment ?? ''}
						text={`Edit the comment for ${kind} ${item.displayName}.`}
						onCancel={() => {
							resolve(undefined);
						}}
						onConfirm={(comment) => {
							resolve(comment);
						}}
					/>
				));

				if (result !== undefined) {
					onSave({
						target: {
							value: state.map((x) =>
								x === item ? {...x, comment: result} : x,
							),
						},
					});
				}
		  };

type PatientPersonalInformationStaticProps = {
	readonly loading: boolean;
	readonly found: boolean;
	readonly patient: PatientDocument;
};

const noSuggestions = () => ({results: []});

const PatientPersonalInformationStatic = (
	{loading: loadingLast, found: foundLast, patient: last}: PatientPersonalInformationStaticProps,
) => {
	const dialog = useDialog();
	const importantStringsDict = useImportantStringsDict();


	const [key, refresh] = useRandom();
	const [{editing, dirty, deleting, current: patient}, dispatch] = usePatientPersonalInformationReducer(last);

	const {loading: loadingInit, dirty: initChanged, results} = useObservedPatientsWithChanges(
		editing ? {filter: {_id: last._id}, limit: 1} : null,
		[editing ? last._id : '', key]
	);

	assert(results.length <= 1, 'At most one patient is returned.');

	const init = results[0];
	const foundInit = init !== undefined;

	useEffect(() => {
		if (editing && !loadingInit && foundInit) {
			dispatch({type: 'merge', payload: init});
		}
	}, [editing, loadingInit, foundInit, JSON.stringify(init)]);

	useEffect(() => {
		if (!loadingLast && foundLast) {
			dispatch({type: 'init', payload: last});
		}
	}, [loadingLast, foundLast, JSON.stringify(last)]);

	usePrompt(
		'You are trying to leave the page while in edit mode. Are you sure you want to continue?',
		dirty,
	);

	const {classes} = useStyles();

	const {value: reifiedNoShows} = useNoShowsForPatient(last._id);

	const localizeBirthdate = useDateFormat('PPP');
	const localizeAge = useDateFormatAge();
	const birthdatePickerProps = useBirthdatePickerProps();

	const readOnly = Boolean(!editing || loadingInit);

	const loading = editing ? loadingInit : loadingLast;

	const found = readOnly ? foundLast : foundInit;

	if (!found) {
		return <NoContent>Patient not found.</NoContent>;
	}

	const placeholder = readOnly ? '?' : 'Write some information here';

	const minRows = 8;
	const maxRows = 100;

	const update =
		(key: string, f = (v) => v) =>
		(e) => {
			dispatch({type: 'update', key, value: f(e.target.value)});
		};

	const updateList = (key: string) =>
		update(key, (v) =>
			list(
				map(({name, displayName, comment}) => {
					return comment === undefined
						? {name, displayName}
						: {name, displayName, comment};
				}, v),
			),
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

	const updateInsurances = updateList('insurances');
	const updateAllergies = updateList('allergies');
	const updateDoctors = updateList('doctors');

	const allergyChipProps = (item) => ({
		avatar: <Avatar>Al</Avatar>,
		onClick: openUpdateTagCommentDialog({
			state: patient.allergies,
			kind: 'allergy',
			readOnly,
			item,
			dialog,
			onSave: updateAllergies,
		}),
	});

	const doctorChipProps = (item) => ({
		avatar: <Avatar>Dr</Avatar>,
		onClick: openUpdateTagCommentDialog({
			state: patient.doctors,
			kind: 'doctor',
			readOnly,
			item,
			dialog,
			onSave: updateDoctors,
		}),
	});

	const insuranceChipProps = (item) => ({
		avatar: <Avatar>In</Avatar>,
		onClick: openUpdateTagCommentDialog({
			state: patient.insurances,
			kind: 'insurance',
			readOnly,
			item,
			dialog,
			onSave: updateInsurances,
		}),
	});

	return (
		<>
		{initChanged && (
			<Alert severity="warning" className={classes.warning}>
				<span>Patient info was updated while editing. </span>
				<span>Current state can be consulted at </span>
				<Link to={`/patient/${last._id}`} target='_blank'>{`/patient/${last._id}`}</Link>.
				<span> You can drop all local changes and load the current state by clicking <UndoIcon className={classes.inlineIcon}/>. You can merge local changes with the current state and continue editing by clicking on <MergeTypeIcon className={classes.inlineIcon}/>.</span>
			</Alert>
		)}
		<Paper className={classes.paper}>
			{loading && <LinearProgress className={classes.progress}/>}
			<Grid container spacing={3} className={classes.grid}>
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
					{isDead && (
						<div>
						<Button
							disabled={readOnly}
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
						</div>
					)}
					{editing && isDead && (
						<div>
						<DatePicker<Date>
							{...birthdatePickerProps}
							readOnly={readOnly}
							label="Death date"
							value={deathdateLegal ?? null}
							slotProps={{
								textField: {
									margin: 'normal',
									InputLabelProps: {shrink: true},
								},
							}}
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
						</div>
					)}
					{!totalNoShow ? null : (
						<ProblemText variant="h4">PVPP = {totalNoShow}</ProblemText>
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
											readOnly={readOnly}
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
											readOnly={readOnly}
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
											readOnly={readOnly}
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
											readOnly={readOnly}
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
											readOnly={readOnly}
											label="Birth date"
											value={_birthdate}
											disabled={!editing}
											slotProps={{
												textField: {
													margin: 'normal',
													InputLabelProps: {shrink: true},
												},
											}}
											onChange={(date) => {
												if (isValid(date)) {
													dispatch({
														type: 'update',
														key: 'birthdate',
														value: eidFormatBirthdate(date!),
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
									disabled={readOnly}
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
									value={patient.antecedents ?? ''}
									margin="normal"
									dict={importantStringsDict}
									onChange={update('antecedents')}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<ColorizedTextarea
									fullWidth
									readOnly={!editing}
									disabled={readOnly}
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
									value={patient.ongoing ?? ''}
									margin="normal"
									dict={importantStringsDict}
									onChange={update('ongoing')}
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<SetPicker
									withoutToggle
									itemToKey={tagToKey}
									itemToString={tagToNode}
									createNewItem={tagCreate}
									useSuggestions={makeSubstringSuggestions(
										useAllergiesFind,
										patient.allergies?.map((x) => x.name),
										'name',
										undefined,
										{displayName: 1},
									)}
									readOnly={readOnly}
									TextFieldProps={{
										label: 'Allergies',
										margin: 'normal',
									}}
									Chip={ReactiveAllergyChip}
									chipProps={allergyChipProps}
									value={(patient.allergies || []) as PatientTag[]}
									placeholder={placeholder}
									onChange={updateAllergies}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									multiline
									readOnly={readOnly}
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
									readOnly={readOnly}
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
									readOnly={readOnly}
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
									readOnly={readOnly}
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
									itemToKey={tagToKey}
									itemToString={tagToNode}
									createNewItem={tagCreate}
									useSuggestions={makeSubstringSuggestions(
										useDoctorsFind,
										patient.doctors?.map((x) => x.name),
										'name',
										undefined,
										{displayName: 1},
									)}
									readOnly={readOnly}
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
											alignItems: 'start',
										},
									}}
									Chip={ReactiveDoctorChip}
									chipProps={doctorChipProps}
									value={(patient.doctors || []) as PatientTag[]}
									placeholder={placeholder}
									onChange={updateDoctors}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									withoutToggle
									className={classes.setPicker}
									itemToKey={tagToKey}
									itemToString={tagToNode}
									createNewItem={tagCreate}
									useSuggestions={makeSubstringSuggestions(
										useInsurancesFind,
										patient.insurances?.map((x) => x.name),
										'name',
										undefined,
										{displayName: 1},
									)}
									readOnly={readOnly}
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
											alignItems: 'start',
										},
									}}
									Chip={ReactiveInsuranceChip}
									chipProps={insuranceChipProps}
									value={(patient.insurances || []) as PatientTag[]}
									placeholder={placeholder}
									onChange={updateInsurances}
								/>
							</Grid>

							<Grid item xs={9}>
								<ColorizedTextarea
									fullWidth
									readOnly={!editing}
									disabled={readOnly}
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
									value={patient.about ?? ''}
									margin="normal"
									dict={importantStringsDict}
									onChange={update('about')}
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField
									fullWidth
									readOnly={readOnly}
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
									readOnly={readOnly}
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
									value={(patient.email ?? []) as PatientEmail[]}
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
				readOnly={readOnly}
				loading={loading}
				dirty={dirty}
				dispatch={dispatch}
				patient={patient}
				patientInit={init}
				initChanged={initChanged}
				refresh={refresh}
			/>
			<PatientDeletionDialog
				open={deleting}
				patient={last}
				onClose={() => {
					dispatch({type: 'not-deleting'});
				}}
			/>
		</Paper>
			</>
	);
};

export default PatientPersonalInformationStatic;
