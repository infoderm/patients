import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';

import SetPicker from '../input/SetPicker.js';

const useStyles = makeStyles((theme) => ({
	photoPlaceHolder: {
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999',
		verticalAlign: 'top',
		marginRight: theme.spacing(2)
	},
	photo: {
		width: 140,
		height: 200,
		verticalAlign: 'top',
		marginRight: theme.spacing(2)
	},
	formControl: {
		margin: theme.spacing(1),
		overflow: 'auto',
		'& input, & div': {
			color: 'black !important'
		}
	},
	container: {
		padding: theme.spacing(3)
	},
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`,
		'& textarea': {
			color: 'black !important'
		}
	}
}));

const CustomTextField = ({value, ...rest}) => (
	<TextField
		InputLabelProps={{
			shrink: value !== '' && value !== undefined && value !== null
		}}
		inputProps={{
			readOnly: true
		}}
		margin="normal"
		value={value}
		{...rest}
	/>
);

const ReadOnlyTextField = (props) => {
	const classes = useStyles();
	return <CustomTextField className={classes.formControl} {...props} />;
};

const MultilineReadOnlyTextField = (props) => {
	const classes = useStyles();
	return <CustomTextField multiline className={classes.multiline} {...props} />;
};

const minRows = 8;
const maxRows = 100;

const LargeMultilineReadOnlyTextField = (props) => (
	<MultilineReadOnlyTextField rows={minRows} rowsMax={maxRows} {...props} />
);

const SmallMultilineReadOnlyTextField = (props) => (
	<MultilineReadOnlyTextField rows={1} {...props} />
);

const PatientSheet = (props) => {
	const classes = useStyles();

	const {patient, consultations, attachments, documents} = props;

	return (
		<Paper>
			<Grid container className={classes.container}>
				<Grid item sm={4} md={2}>
					{patient.photo ? (
						<img
							className={classes.photo}
							src={`data:image/png;base64,${patient.photo}`}
							title={`${patient.firstname} ${patient.lastname}`}
						/>
					) : (
						<div className={classes.photoPlaceHolder}>
							{patient.firstname ? patient.firstname[0] : '?'}
							{patient.lastname ? patient.lastname[0] : '?'}
						</div>
					)}
				</Grid>
				<Grid item sm={8} md={10}>
					<form>
						<Grid container>
							<Grid item xs={2}>
								<ReadOnlyTextField label="NISS" value={patient.niss} />
							</Grid>
							<Grid item xs={3}>
								<ReadOnlyTextField label="Last name" value={patient.lastname} />
							</Grid>
							<Grid item xs={3}>
								<ReadOnlyTextField
									label="First name"
									value={patient.firstname}
								/>
							</Grid>
							<Grid item xs={2}>
								<ReadOnlyTextField label="Sex" value={patient.sex} />
							</Grid>
							<Grid item xs={2}>
								<ReadOnlyTextField
									label="Birth date"
									value={patient.birthdate}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<LargeMultilineReadOnlyTextField
									label="Antécédents"
									value={patient.antecedents}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<LargeMultilineReadOnlyTextField
									label="Traitement en cours"
									value={patient.ongoing}
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x}
									itemToString={(x) => x}
									TextFieldProps={{
										label: 'Allergies',
										margin: 'normal'
									}}
									chipProps={{
										avatar: <Avatar>Al</Avatar>
									}}
									value={patient.allergies || []}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<SmallMultilineReadOnlyTextField
									label="Rue et Numéro"
									value={patient.streetandnumber}
								/>
							</Grid>
							<Grid item xs={12} md={2}>
								<SmallMultilineReadOnlyTextField
									label="Code Postal"
									value={patient.zip}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SmallMultilineReadOnlyTextField
									label="Commune"
									value={patient.municipality}
								/>
							</Grid>

							<Grid item xs={12} md={4}>
								<SmallMultilineReadOnlyTextField
									label="Numéro de téléphone"
									value={patient.phone}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x}
									itemToString={(x) => x}
									TextFieldProps={{
										label: 'Médecin Traitant',
										margin: 'normal'
									}}
									chipProps={{
										avatar: <Avatar>Dr</Avatar>
									}}
									value={patient.doctors || []}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x}
									itemToString={(x) => x}
									TextFieldProps={{
										label: 'Mutuelle',
										margin: 'normal'
									}}
									chipProps={{
										avatar: <Avatar>In</Avatar>
									}}
									value={patient.insurances || []}
								/>
							</Grid>

							<Grid item xs={9}>
								<MultilineReadOnlyTextField
									rows={2}
									rowsMax={maxRows}
									label="About"
									value={patient.about}
								/>
							</Grid>
							<Grid item xs={3}>
								<MultilineReadOnlyTextField
									label="PVPP"
									value={patient.noshow || 0}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x._id}
									itemToString={(x) => x._id}
									TextFieldProps={{
										label: 'Consultations',
										margin: 'normal'
									}}
									value={consultations || []}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x._id}
									itemToString={(x) => x._id}
									TextFieldProps={{
										label: 'Documents',
										margin: 'normal'
									}}
									value={documents || []}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x._id}
									itemToString={(x) => x._id}
									TextFieldProps={{
										label: 'Attachments',
										margin: 'normal'
									}}
									value={attachments || []}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Grid>
		</Paper>
	);
};

PatientSheet.propTypes = {
	patient: PropTypes.object.isRequired,
	consultations: PropTypes.array.isRequired,
	attachments: PropTypes.array.isRequired,
	documents: PropTypes.array.isRequired
};

export default PatientSheet;
