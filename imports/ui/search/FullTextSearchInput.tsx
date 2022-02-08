import React, {useState} from 'react';

import {useNavigate} from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';

import {myEncodeURIComponent} from '../../util/uri';

import SearchBox from '../input/SearchBox';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants';

const THRESHOLD_HISTORY_PUSH = 2000; // 2 seconds
const DEBOUNCE_HISTORY_UPDATE = TIMEOUT_INPUT_DEBOUNCE;

const useStyles = makeStyles((theme) => ({
	searchBox: {
		background: alpha(theme.palette.common.white, 0.15),
		'&:hover': {
			background: alpha(theme.palette.common.white, 0.25),
		},
	},
}));

const FullTextSearchInput = ({sx}) => {
	const navigate = useNavigate();
	const classes = useStyles();
	const [lastHistoryUpdate, setLastHistoryUpdate] = useState(0);
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
		<Box sx={sx}>
			<SearchBox
				expands
				className={classes.searchBox}
				placeholder="Search a patient…"
				aria-label="Patient search"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</Box>
	);
};

export default FullTextSearchInput;
