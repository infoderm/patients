import React from 'react';

import DataGridModelContext from './DataGridModelContext';
import useDataGridModelState from './useDataGridModelState';

const DataGridModelProvider = ({children}) => {
	const state = useDataGridModelState();
	return (
		<DataGridModelContext.Provider value={state}>
			{children}
		</DataGridModelContext.Provider>
	);
};

export default DataGridModelProvider;
