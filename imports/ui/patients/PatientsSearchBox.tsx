import React from 'react';
import {styled, alpha} from '@mui/material/styles';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import {useNavigate} from 'react-router-dom';

import {patients} from '../../api/patients';

import SearchBoxWithSuggestions from '../input/SearchBoxWithSuggestions';
import usePatientsSuggestions from './usePatientsSuggestions';
import {PatientCacheResult} from '../../api/collection/patients/search/cache';

const PREFIX = 'PatientsSearchBox';

const classes = {
	searchBox: `${PREFIX}-searchBox`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.searchBox}`]: {
		background: alpha(theme.palette.common.white, 0.15),
		'&:hover': {
			background: alpha(theme.palette.common.white, 0.25),
		},
	},
}));

const PatientsSearchBox = ({className}) => {
	const navigate = useNavigate();

	const handleChange = ({selectedItem = null}: {selectedItem?: PatientCacheResult | null}) => {
		if (selectedItem) {
			navigate(`/patient/${selectedItem._id}`);
		}
	};

	return (
		<Root className={className}>
			<SearchBoxWithSuggestions
				expands
				className={classes.searchBox}
				useSuggestions={usePatientsSuggestions}
				itemToString={(item) => (item ? patients.toString(item) : '')}
				itemToKey={patients.toKey}
				icon={<PersonSearchIcon />}
				placeholder="Search a patient…"
				onSelectedItemChange={handleChange}
			/>
		</Root>
	);
};

export default PatientsSearchBox;
