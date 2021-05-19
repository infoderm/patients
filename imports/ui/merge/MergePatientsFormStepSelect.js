import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import {patients} from '../../api/patients.js';

import SetPicker from '../input/SetPicker.js';

import PatientGridItem from '../patients/PatientGridItem.js';
import ReactivePatientCard from '../patients/ReactivePatientCard.js';
import makePatientsSuggestions from '../patients/makePatientsSuggestions.js';

const MergePatientsFormStepSelect = ({
	selection,
	setSelection,
	placeholder,
	label
}) => (
	<Grid container spacing={2}>
		<Grid item xs={12}>
			<SetPicker
				itemToKey={(x) => x._id}
				itemToString={patients.toString}
				useSuggestions={makePatientsSuggestions(selection)}
				TextFieldProps={{
					label,
					margin: 'normal'
				}}
				value={selection}
				placeholder={placeholder}
				onChange={(e) => setSelection(e.target.value)}
			/>
		</Grid>
		<Grid item container xs={12} spacing={3}>
			{selection.map((patient) => (
				<PatientGridItem
					key={patient._id}
					Card={ReactivePatientCard}
					patient={patient}
				/>
			))}
		</Grid>
	</Grid>
);

MergePatientsFormStepSelect.defaultProps = {
	label: 'Select patients',
	placeholder: 'Select patients by entering their names here'
};

MergePatientsFormStepSelect.propTypes = {
	selection: PropTypes.array.isRequired,
	setSelection: PropTypes.func.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string
};

export default MergePatientsFormStepSelect;
