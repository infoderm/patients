import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import {useNavigate} from 'react-router-dom';

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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';
import useUniqueId from '../hooks/useUniqueId';

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

const NewPatientForm = () => {
	const [niss, setNiss] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [sex, setSex] = useState('');
	const [noshow, setNoshow] = useState(0);

	const lastnameId = useUniqueId('new-patient-form-input-lastname');
	const firstnameId = useUniqueId('new-patient-form-input-firstname');

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		const patient = {
			niss,
			firstname,
			lastname,
			birthdate,
			sex,
			noshow,
		};

		try {
			const _id = await call(patientsInsert, patient);
			navigate(`/patient/${_id}`);
		} catch (error: unknown) {
			console.error(error);
		}
	};

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
									id={lastnameId}
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
									id={firstnameId}
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
								<TextField
									fullWidth
									type="date"
									label="Birth date"
									InputLabelProps={{
										shrink: true,
									}}
									value={birthdate}
									onChange={(e) => {
										setBirthdate(e.target.value);
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
							className={classes.button}
							color="primary"
							endIcon={<PersonAddIcon />}
							onClick={handleSubmit}
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
