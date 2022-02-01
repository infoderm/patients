import React, {useState} from 'react';

import TextField from '@material-ui/core/TextField';

import DrugsTable from './DrugsTable';

const DrugSearch = () => {
	const [query, setQuery] = useState('');

	return (
		<div>
			<TextField
				autoFocus
				label="Query"
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
				}}
			/>
			<DrugsTable query={query} />
		</div>
	);
};

export default DrugSearch;
