import {useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import handleDrop from './handleDrop';

const useOnDrop = () => {
	const history = useHistory();
	return useMemo(() => handleDrop(history), [history]);
};

export default useOnDrop;
