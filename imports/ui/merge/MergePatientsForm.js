import React, {useState} from 'react';

import {all, map, list, filter} from '@aureooms/js-itertools';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipNextIcon from '@material-ui/icons/SkipNext';

import {usePatientsAdvancedFind} from '../../api/patients.js';
import {normalizeSearch} from '../../api/string.js';

import SetPicker from '../input/SetPicker.js';

import PatientGridItem from '../patients/PatientGridItem.js';
import ReactivePatientCard from '../patients/ReactivePatientCard.js';

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

const patientToString = (x) => `${x.lastname} ${x.firstname} (${x._id})`;

const makeSuggestions = (set) => (searchString) => {
	const $search = normalizeSearch(searchString);
	const limit = 5;

	const query = {$text: {$search}};

	const sort = {
		score: {$meta: 'textScore'}
	};
	const fields = {
		...sort,
		_id: 1,
		firstname: 1,
		lastname: 1
	};

	const options = {
		fields,
		sort,
		skip: 0,
		limit
	};

	const {loading, results, dirty} = usePatientsAdvancedFind(query, options, [
		$search
		// refreshKey,
	]);

	// Find a way to exclude directly in query to always return 5 results if
	// possible
	const notInSet = (x) => all(map((y) => x._id !== y._id, set));

	return {
		loading,
		results: list(filter(notInSet, results)),
		dirty
	};
};

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
								itemToString={patientToString}
								useSuggestions={makeSuggestions(toMerge)}
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
