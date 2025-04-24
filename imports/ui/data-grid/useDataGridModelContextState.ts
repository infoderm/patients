import {useContext} from 'react';

import DataGridModelContext from './DataGridModelContext';

const useDataGridModelContextState = () => useContext(DataGridModelContext);

export default useDataGridModelContextState;
