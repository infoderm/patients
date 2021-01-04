import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';

import {myEncodeURIComponent} from '../../client/uri.js';

import SearchBox from '../input/SearchBox.js';

import {TIMEOUT_INPUT_DEBOUNCE} from '../constants.js';

const THRESHOLD_HISTORY_PUSH = 2000; // 2 seconds
const DEBOUNCE_HISTORY_UPDATE = TIMEOUT_INPUT_DEBOUNCE;

export default function FullTextSearchInput({className}) {
	const history = useHistory();
	const [lastHistoryUpdate, setLastHistoryUpdate] = useState(0);
	const [value, setValue] = useState('');
	const [pending, setPending] = useState(undefined);

	const updateHistory = (newValue) => {
		clearTimeout(pending);
		setPending(
			setTimeout(() => {
				const url = `/search/${myEncodeURIComponent(newValue)}`;
				const now = new Date();
				const timeSinceLastHistoryUpdate = now - lastHistoryUpdate;
				if (timeSinceLastHistoryUpdate >= THRESHOLD_HISTORY_PUSH) {
					history.push(url);
				} else {
					history.replace(url);
				}

				setLastHistoryUpdate(now);
			}, DEBOUNCE_HISTORY_UPDATE)
		);
	};

	const onChange = (e) => {
		setValue(e.target.value);
		updateHistory(e.target.value);
	};

	const onBlur = () => setValue('');

	return (
		<div className={className}>
			<SearchBox
				placeholder="Search a patient…"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	);
}
