import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import call from '../../api/call';

const styles = (theme) => ({
	container: {
		height: '100%'
	},
	form: {
		padding: theme.spacing(1.5)
	},
	button: {
		marginLeft: 'auto'
	}
});

const useStyles = makeStyles(styles);

const NewPatientForm = () => {
	const [niss, setNiss] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [sex, setSex] = useState('');
	const [noshow, setNoshow] = useState(0);

	const history = useHistory();
	const classes = useStyles();

	const handleSubmit = async (event) => {
		event.preventDefault();

		const patient = {
			niss,
			firstname,
			lastname,
			birthdate,
			sex,
			noshow
		};

		try {
			const _id = await call('patients.insert', patient);
			history.push({pathname: `/patient/${_id}`});
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<Grid
			container
			className={classes.container}
			justify="center"
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
											id: 'sex-input'
										}}
										onChange={(e) => {
											setSex(e.target.value as string);
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
										shrink: true
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
							aria-label="add"
							endIcon={<PersonAddIcon />}
							onClick={handleSubmit}
						>
							Create new patient
						</Button>
					</CardActions>
				</Card>
			</Grid>
		</Grid>
	);
};

export default NewPatientForm;
