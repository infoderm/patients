import React, {useState} from 'react';
import {useDebounce} from 'use-debounce';

import {map, list} from '@aureooms/js-itertools';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipNextIcon from '@material-ui/icons/SkipNext';

import {patients, usePatientsAdvancedFind} from '../../api/patients.js';
import {normalizeSearch} from '../../api/string.js';

import SetPicker from '../input/SetPicker.js';

import PatientGridItem from '../patients/PatientGridItem.js';
import ReactivePatientCard from '../patients/ReactivePatientCard.js';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants.js';

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

const DEBOUNCE_OPTIONS = {leading: false};
// TODO this does not work because we do not render on an empty input

const makeSuggestions = (set) => (searchString) => {
	const [debouncedSearchString, {pending, cancel, flush}] = useDebounce(
		searchString,
		TIMEOUT_INPUT_DEBOUNCE,
		DEBOUNCE_OPTIONS
	);

	const $search = normalizeSearch(debouncedSearchString);
	const $nin = list(map((x) => x._id, set));
	const limit = 5;

	const query = {$text: {$search}, _id: {$nin}};

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

	const {loading, ...rest} = usePatientsAdvancedFind(query, options, [
		$search,
		JSON.stringify($nin)
		// refreshKey,
	]);

	return {
		loading: loading || pending(),
		cancel,
		flush,
		...rest
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
								itemToString={patients.toString}
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
