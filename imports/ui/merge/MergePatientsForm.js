import React, { useState } from 'react' ;
import PropTypes from 'prop-types';

import { all } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;
import { take } from '@aureooms/js-itertools' ;

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipNextIcon from '@material-ui/icons/SkipNext';

import { makeIndex } from '../../api/string.js';

import SetPicker from '../input/SetPicker.js';

import PatientCard from '../patients/PatientCard.js';
import PatientSheet from '../patients/PatientSheet.js';

import MergePatientsFormStepPrepare from './MergePatientsFormStepPrepare.js';

const useStyles = makeStyles(
	theme => ({
		container: {
			padding: theme.spacing(3),
		},
		button: {
			margin: theme.spacing(1),
		},
		rightIcon: {
			marginLeft: theme.spacing(1),
		},
	})
);

const patientToString = x => `${x.lastname} ${x.firstname} (${x._id})` ;

const tagFilter = set => (suggestions, inputValue) => {

	const notInSet = x => all(map(y=>x._id !== y._id, set)) ;
	const matches = makeIndex(inputValue);

	const keep = 5 ;

	return list(
		take(
			filter(
				notInSet,
				filter(
					x => matches(patientToString(x)),
					suggestions
				)
			) ,
			keep
		)
	) ;

} ;

export default function MergePatientsForm ( { patients } ) {

	const [step, setStep] = useState('select');
	const [toMerge, setToMerge] = useState([]);

	const classes = useStyles();

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
								onChange={e => setToMerge(e.target.value)}
								placeholder="Select patients to merge by entering their names here"
							/>
						</Grid>
						<Grid item sm={12} md={12}>
							<Grid container spacing={3} className={classes.container}>
							  { toMerge.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
							</Grid>
						</Grid>
						{ toMerge.length >= 2 && <Grid item sm={12} md={12}>
							<Button variant="contained" className={classes.button} color="primary" onClick={()=>setStep('prepare')}>
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
					onPrevStep={()=>setStep('select')}
					onNextStep={()=>setStep('confirm')}
				/>
			);
		default:
			return <div>Unknown step <i>{step}</i></div>;

	}

}

MergePatientsForm.propTypes = {
	patients: PropTypes.array.isRequired,
};
