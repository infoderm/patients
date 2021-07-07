import React from 'react';

import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {fade} from '@material-ui/core/styles/colorManipulator';

import {patients} from '../../api/patients';

import SearchBoxWithSuggestions from '../input/SearchBoxWithSuggestions';
import usePatientsSuggestions from './usePatientsSuggestions';

const useStyles = makeStyles((theme) => ({
	searchBox: {
		background: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			background: fade(theme.palette.common.white, 0.25)
		}
	}
}));

const PatientsSearchBox = ({className}) => {
	const history = useHistory();
	const classes = useStyles();

	const handleChange = ({selectedItem = null}) => {
		if (selectedItem) {
			history.push(`/patient/${selectedItem._id}`);
		}
	};

	return (
		<div className={className}>
			<SearchBoxWithSuggestions
				expands
				className={classes.searchBox}
				useSuggestions={usePatientsSuggestions}
				itemToString={(item) => (item ? patients.toString(item) : '')}
				itemToKey={patients.toKey}
				placeholder="Search a patient…"
				onSelectedItemChange={handleChange}
			/>
		</div>
	);
};

export default PatientsSearchBox;
