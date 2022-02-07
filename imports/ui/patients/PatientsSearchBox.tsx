import React from 'react';
import {useNavigate} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import {fade} from '@material-ui/core/styles/colorManipulator';

import {patients} from '../../api/patients';

import SearchBoxWithSuggestions from '../input/SearchBoxWithSuggestions';
import usePatientsSuggestions from './usePatientsSuggestions';

const useStyles = makeStyles((theme) => ({
	searchBox: {
		background: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			background: fade(theme.palette.common.white, 0.25),
		},
	},
}));

const PatientsSearchBox = ({className}) => {
	const navigate = useNavigate();
	const classes = useStyles();

	const handleChange = ({selectedItem = null}) => {
		if (selectedItem) {
			navigate(`/patient/${selectedItem._id}`);
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
