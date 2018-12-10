import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { all } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;
import { chain } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;
import { take } from '@aureooms/js-itertools' ;

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipNextIcon from '@material-ui/icons/SkipNext';

import SetPicker from '../input/SetPicker.js';

import PatientCard from '../patients/PatientCard.js';
import PatientDetailsPicker from '../patients/PatientDetailsPicker.js';
import PatientSheet from '../patients/PatientSheet.js';

import MergePatientsFormStepPrepare from './MergePatientsFormStepPrepare.js';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

const patientToString = x => `${x.lastname} ${x.firstname} (${x._id})` ;

const tagFilter = set => (suggestions, inputValue) => {

	const notInSet = x => all(map(y=>x._id !== y._id, set)) ;
	const matches = x => !inputValue || patientToString(x).toLowerCase().includes(inputValue.toLowerCase()) ;

	const keep = 5 ;

	return list( take( filter(notInSet, filter(matches, suggestions) ) , keep ) ) ;

} ;

class MergePatientsForm extends React.Component {

	state = {
		step: 'select',
		toMerge: [],
	};


	render ( ) {

		const { classes, theme, patients } = this.props ;
		const { step , toMerge } = this.state;

		switch ( step ) {

			case 'select':
				return (
					<div>
						<Typography variant="h4">Select patients to merge</Typography>
						<Grid container className={classes.container}>
							<Grid item sm={12} md={12}>
								<SetPicker
									suggestions={patients}
									itemToKey={x=>x._id}
									itemToString={patientToString}
									filter={tagFilter(toMerge)}
									TextFieldProps={{
										label: "Patients to merge",
										margin: "normal",
									}}
									value={toMerge}
									onChange={e => this.setState({ toMerge : e.target.value })}
									placeholder="Select patients to merge by entering their names here"
								/>
							</Grid>
							<Grid item sm={12} md={12}>
								<Grid container spacing={24} className={classes.container}>
								  { toMerge.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
								</Grid>
							</Grid>
							{ toMerge.length >= 2 && <Grid item sm={12} md={12}>
								<Button variant="contained" className={classes.button} color="primary" onClick={()=>this.setState({ step: 'prepare'})}>
									Next
									<SkipNextIcon className={classes.rightIcon}/>
								</Button>
							</Grid> }
						</Grid>
					</div>
				);

			case 'prepare':
				return (
					<MergePatientsFormStepPrepare
						toMerge={list(map(x=>x._id,toMerge))}
						onPrevStep={()=>this.setState({ step: 'select'})}
						onNextStep={()=>this.setState({ step: 'confirm'})}
					/>
				);
			default:
				return <div>Unknown step <i>{step}</i></div>;

		}


	}

}

MergePatientsForm.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	patients: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(MergePatientsForm);
