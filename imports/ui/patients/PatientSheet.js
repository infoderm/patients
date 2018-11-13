import { Meteor } from 'meteor/meteor' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import SetPicker from '../input/SetPicker.js';

const styles = theme => ({
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
		marginRight: theme.spacing.unit * 2,
	},
	photo: {
		width: 140,
		height: 200,
		verticalAlign: 'top',
		marginRight: theme.spacing.unit * 2,
	},
	formControl: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		'& input, & div' : {
			color: 'black !important',
		} ,
	},
	container: {
		padding: theme.spacing.unit * 3,
	},
	multiline: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing.unit*2}px)`,
		'& textarea' : {
			color: 'black !important',
		} ,
	},
});

class PatientSheet extends React.Component {

	render ( ) {

		const { classes, theme, patient, consultations} = this.props ;

		const minRows = 8 ;
		const maxRows = 100 ;

		return (
			<div>
				<Grid container className={classes.container}>
					<Grid item sm={4} md={2}>
						{ patient.photo ?
						<img
							className={classes.photo}
							src={`data:image/png;base64,${patient.photo}`}
							title={`${patient.firstname} ${patient.lastname}`}
						/> :
						<div className={classes.photoPlaceHolder}>
							{patient.firstname ? patient.firstname[0] : '?'}{patient.lastname ? patient.lastname[0] : '?'}
						</div>
						}
					</Grid>
					<Grid item sm={8} md={10}>
						<form>
						<Grid container>
							<Grid item xs={2}>
								<TextField className={classes.formControl}
									label="NISS"
									value={patient.niss}
									inputProps={{
										readOnly: true,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField className={classes.formControl}
									label="Last name"
									value={patient.lastname}
									inputProps={{
										readOnly: true,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={3}>
								<TextField className={classes.formControl}
									label="First name"
									value={patient.firstname}
									inputProps={{
										readOnly: true,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={2}>
								<TextField className={classes.formControl}
									label="Sex"
									value={patient.sex}
									inputProps={{
										readOnly: true,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={2}>
								<TextField className={classes.formControl}
									label="Birth date"
									value={patient.birthdate}
									inputProps={{
										readOnly: true,
									}}
									margin="normal"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="Antécédents"
								multiline
								rows={minRows}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.antecedents}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={6}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="Traitement en cours"
								multiline
								rows={minRows}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.ongoing}
								margin="normal"
							/>
							</Grid>

							<Grid item xs={12} md={12}>
								<SetPicker
									suggestions={[]}
									filter={x=>x}
									itemToKey={x=>x}
									itemToString={x=>x}
									readOnly={true}
									TextFieldProps={{
										label: "Allergies",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>Al</Avatar>,
									}}
									value={patient.allergies || []}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="Rue et Numéro"
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.streetandnumber}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={2}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="Code Postal"
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.zip}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="Commune"
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.municipality}
								margin="normal"
							/>
							</Grid>

							<Grid item xs={12} md={4}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="Numéro de téléphone"
								multiline
								rows={1}
								className={classes.multiline}
								value={patient.phone}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									suggestions={[]}
									filter={x=>x}
									itemToKey={x=>x}
									itemToString={x=>x}
									readOnly={true}
									TextFieldProps={{
										label: "Médecin Traitant",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>Dr</Avatar>,
									}}
									value={patient.doctors || []}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									suggestions={[]}
									filter={x=>x}
									itemToKey={x=>x}
									itemToString={x=>x}
									readOnly={true}
									TextFieldProps={{
										label: "Mutuelle",
										margin: "normal",
									}}
									chipProps={{
										avatar: <Avatar>In</Avatar>,
									}}
									value={patient.insurances || []}
								/>
							</Grid>

							<Grid item xs={9}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="About"
								multiline
								rows={2}
								rowsMax={maxRows}
								className={classes.multiline}
								value={patient.about}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={3}>
							<TextField
								inputProps={{
									readOnly: true,
								}}
								label="PVPP"
								className={classes.multiline}
								value={patient.noshow || 0}
								margin="normal"
							/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									suggestions={[]}
									filter={x=>x}
									itemToKey={x=>x._id}
									itemToString={x=>x._id}
									readOnly={true}
									TextFieldProps={{
										label: "Consultations",
										margin: "normal",
									}}
									value={consultations || []}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									suggestions={[]}
									filter={x=>x}
									itemToKey={x=>x}
									itemToString={x=>x}
									readOnly={true}
									TextFieldProps={{
										label: "Attachments",
										margin: "normal",
									}}
									value={patient.attachments || []}
								/>
							</Grid>
						</Grid>
						</form>
					</Grid>
				</Grid>
			</div>
		);
	}

}

PatientSheet.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	patient: PropTypes.object.isRequired,
	consultations: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(PatientSheet);
