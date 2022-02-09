import {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import useDialog from '../modal/useDialog';
import handleDrop from './handleDrop';

const useOnDrop = () => {
	const navigate = useNavigate();
	const dialog = useDialog();
	return useMemo(() => handleDrop(navigate, dialog), [navigate, dialog]);
};

export default useOnDrop;
