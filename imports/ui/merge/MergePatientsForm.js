import React, {useState} from 'react';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipNextIcon from '@material-ui/icons/SkipNext';

import {patients} from '../../api/patients.js';

import SetPicker from '../input/SetPicker.js';

import PatientGridItem from '../patients/PatientGridItem.js';
import ReactivePatientCard from '../patients/ReactivePatientCard.js';
import makePatientsSuggestions from '../patients/makePatientsSuggestions.js';

import MergePatientsFormStepPrepare from './MergePatientsFormStepPrepare.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	},
	button: {
		margin: theme.spacing(1)
	},
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const MergePatientsForm = () => {
	const [step, setStep] = useState('select');
	const [toMerge, setToMerge] = useState([]);

	const classes = useStyles();

	switch (step) {
		case 'select':
			return (
				<div>
					<Typography variant="h4">Select patients to merge</Typography>
					<Grid container className={classes.container}>
						<Grid item sm={12} md={12}>
							<SetPicker
								itemToKey={(x) => x._id}
								itemToString={patients.toString}
								useSuggestions={makePatientsSuggestions(toMerge)}
								TextFieldProps={{
									label: 'Patients to merge',
									margin: 'normal'
								}}
								value={toMerge}
								placeholder="Select patients to merge by entering their names here"
								onChange={(e) => setToMerge(e.target.value)}
							/>
						</Grid>
						<Grid item sm={12} md={12}>
							<Grid container spacing={3} className={classes.container}>
								{toMerge.map((patient) => (
									<PatientGridItem
										key={patient._id}
										Card={ReactivePatientCard}
										patient={patient}
									/>
								))}
							</Grid>
						</Grid>
						{toMerge.length >= 2 && (
							<Grid item sm={12} md={12}>
								<Button
									variant="contained"
									className={classes.button}
									color="primary"
									onClick={() => setStep('prepare')}
								>
									Next
									<SkipNextIcon className={classes.rightIcon} />
								</Button>
							</Grid>
						)}
					</Grid>
				</div>
			);

		case 'prepare':
			return (
				<MergePatientsFormStepPrepare
					toMerge={list(map((x) => x._id, toMerge))}
					onPrevStep={() => setStep('select')}
					onNextStep={() => setStep('confirm')}
				/>
			);
		default:
			return (
				<div>
					Unknown step <i>{step}</i>
				</div>
			);
	}
};

export default MergePatientsForm;
