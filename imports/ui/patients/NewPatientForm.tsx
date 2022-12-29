import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import {DatePicker} from '@mui/x-date-pickers';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import {useSnackbar} from 'notistack';

import isValid from 'date-fns/isValid';
import dateFormat from 'date-fns/format';

import {BIRTHDATE_FORMAT} from '../../api/collection/patients';

import patientsInsert from '../../api/endpoint/patients/insert';
import call from '../../api/endpoint/call';

import useBirthdatePickerProps from '../birthdate/useBirthdatePickerProps';
import debounceSnackbar from '../../util/debounceSnackbar';

const PREFIX = 'NewPatientForm';

const classes = {
	container: `${PREFIX}-container`,
	form: `${PREFIX}-form`,
	button: `${PREFIX}-button`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
	[`&.${classes.container}`]: {
		height: '100%',
	},

	[`& .${classes.form}`]: {
		padding: theme.spacing(1.5),
	},

	[`& .${classes.button}`]: {
		marginLeft: 'auto',
	},
}));

interface OnSubmitProps {
	niss: string;
	firstname: string;
	lastname: string;
	birthdate: Date | null;
	sex: string;
	noshow: number;
}

const useSubmit = ({
	niss,
	firstname,
	lastname,
	birthdate,
	sex,
	noshow,
}: OnSubmitProps) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const navigate = useNavigate();
	return useCallback(
		async (event) => {
			event.preventDefault();

			const serializeDate = (datetime: Date) =>
				dateFormat(datetime, BIRTHDATE_FORMAT);

			const patient = {
				niss,
				firstname,
				lastname,
				birthdate:
					birthdate !== null && isValid(birthdate)
						? serializeDate(birthdate)
						: undefined,
				sex,
				noshow,
			};

			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback(`Creating patient ${lastname} ${firstname}...`, {
				variant: 'info',
				persist: true,
			});

			return call(patientsInsert, patient).then(
				(_id) => {
					feedback('Patient created!', {variant: 'success'});
					navigate(`/patient/${_id}`);
				},
				(error: unknown) => {
					const message =
						error instanceof Error ? error.message : 'unknown error';
					feedback(message, {variant: 'error'});
				},
			);
		},
		[niss, firstname, lastname, birthdate, sex, noshow],
	);
};

const NewPatientForm = () => {
	const [niss, setNiss] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [error, setError] = useState(null);
	const [birthdate, setBirthdate] = useState<Date | null>(null);
	const [sex, setSex] = useState('');
	const [noshow, setNoshow] = useState(0);

	const birthdatePickerProps = useBirthdatePickerProps();

	const submit = useSubmit({
		niss,
		firstname,
		lastname,
		birthdate,
		sex,
		noshow,
	});

	return (
		<StyledGrid
			container
			className={classes.container}
			justifyContent="center"
			alignItems="center"
		>
			<Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
				<Card>
					<CardHeader title="Patient information" />
					<CardContent>
						<Grid container className={classes.form} spacing={3}>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Last name"
									value={lastname}
									onChange={(e) => {
										setLastname(e.target.value);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="First name"
									value={firstname}
									onChange={(e) => {
										setFirstname(e.target.value);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel htmlFor="sex-input">Sex</InputLabel>
									<Select
										value={sex}
										input={<Input id="sex-input" />}
										inputProps={{
											name: 'sex',
											id: 'sex-input',
										}}
										onChange={(e) => {
											setSex(e.target.value);
										}}
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
							<Grid item xs={6}>
								<DatePicker
									{...birthdatePickerProps}
									label="Birthdate"
									value={birthdate}
									renderInput={(props) => (
										<TextField
											{...props}
											fullWidth
											helperText={error}
											InputLabelProps={{shrink: true}}
										/>
									)}
									onChange={(pickedDatetime) => {
										setBirthdate(pickedDatetime);
									}}
									onError={(reason) => {
										setError(
											reason === null
												? null
												: reason === 'maxDate'
												? 'Birthdate is in the future'
												: reason === 'minDate'
												? 'Birthdate is too far in the past'
												: reason === 'invalidDate'
												? 'Birthdate is invalid'
												: reason,
										);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="NISS"
									value={niss}
									onChange={(e) => {
										setNiss(e.target.value);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<FormControlLabel
									control={
										<Checkbox
											checked={Boolean(noshow)}
											onChange={(e) => {
												setNoshow(e.target.checked ? 1 : 0);
											}}
										/>
									}
									label="PVPP"
								/>
							</Grid>
						</Grid>
					</CardContent>
					<CardActions>
						<Button
							disabled={Boolean(error)}
							className={classes.button}
							color="primary"
							endIcon={<PersonAddIcon />}
							onClick={submit}
						>
							Create new patient
						</Button>
					</CardActions>
				</Card>
			</Grid>
		</StyledGrid>
	);
};

export default NewPatientForm;
