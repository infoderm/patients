import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled, alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import {myEncodeURIComponent} from '../../lib/uri';

import SearchBox from '../input/SearchBox';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';

const PREFIX = 'FullTextSearchInput';

const classes = {
	searchBox: `${PREFIX}-searchBox`,
};

const StyledBox = styled(Box)(({theme}) => ({
	[`& .${classes.searchBox}`]: {
		background: alpha(theme.palette.common.white, 0.15),
		'&:hover': {
			background: alpha(theme.palette.common.white, 0.25),
		},
	},
}));

const THRESHOLD_HISTORY_PUSH = 2000; // 2 seconds
const DEBOUNCE_HISTORY_UPDATE = TIMEOUT_INPUT_DEBOUNCE;

const FullTextSearchInput = ({sx}) => {
	const navigate = useNavigate();

	const [lastHistoryUpdate, setLastHistoryUpdate] = useState(
		Number.NEGATIVE_INFINITY,
	);
	const [value, setValue] = useState('');
	const [pending, setPending] = useState(undefined);

	const updateHistory = (newValue) => {
		clearTimeout(pending);
		setPending(
			setTimeout(() => {
				const url = `/search/${myEncodeURIComponent(newValue)}`;
				const now = Date.now();
				const timeSinceLastHistoryUpdate = now - lastHistoryUpdate;
				if (timeSinceLastHistoryUpdate >= THRESHOLD_HISTORY_PUSH) {
					navigate(url);
				} else {
					navigate(url, {replace: true});
				}

				setLastHistoryUpdate(now);
			}, DEBOUNCE_HISTORY_UPDATE),
		);
	};

	const onChange = (e) => {
		setValue(e.target.value);
		updateHistory(e.target.value);
	};

	const onBlur = () => {
		setValue('');
	};

	return (
		<StyledBox sx={sx}>
			<SearchBox
				expands
				className={classes.searchBox}
				placeholder="Search a patient…"
				icon={<PersonSearchIcon />}
				aria-label="Patient search"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</StyledBox>
	);
};

export default FullTextSearchInput;
