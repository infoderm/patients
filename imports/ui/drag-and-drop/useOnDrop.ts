import {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import handleDrop from './handleDrop';

const useOnDrop = () => {
	const navigate = useNavigate();
	return useMemo(() => handleDrop(navigate), [navigate]);
};

export default useOnDrop;
