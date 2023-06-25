import React, {useState} from 'react';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import SkipNextIcon from '@mui/icons-material/SkipNext';

import {type PatientDocument} from '../../api/collection/patients';

import MergePatientsFormStepSelect from './MergePatientsFormStepSelect';
import MergePatientsFormStepPrepare from './MergePatientsFormStepPrepare';

const MergePatientsForm = () => {
	const [step, setStep] = useState('select');
	const [toMerge, setToMerge] = useState<PatientDocument[]>([]);

	switch (step) {
		case 'select': {
			return (
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h4">Select patients to merge</Typography>
					</Grid>
					<Grid item xs={12}>
						<MergePatientsFormStepSelect
							selection={toMerge}
							setSelection={setToMerge}
							label="Patients to merge"
							placeholder="Select patients to merge by entering their names here"
						/>
					</Grid>
					{toMerge.length >= 2 && (
						<Grid item xs={12}>
							<Button
								variant="contained"
								color="primary"
								endIcon={<SkipNextIcon />}
								onClick={() => {
									setStep('prepare');
								}}
							>
								Next
							</Button>
						</Grid>
					)}
				</Grid>
			);
		}

		case 'prepare': {
			return (
				<MergePatientsFormStepPrepare
					toMerge={list(map((x) => x._id, toMerge))}
					onPrevStep={() => {
						setStep('select');
					}}
				/>
			);
		}

		default: {
			return (
				<div>
					Unknown step <i>{step}</i>
				</div>
			);
		}
	}
};

export default MergePatientsForm;
