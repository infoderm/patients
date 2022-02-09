import {useContext, useMemo} from 'react';
import dialog, {ComponentExecutor, Options} from './dialog';
import ModalContext from './ModalContext';

const useDialog = () => {
	const [append, replace, remove, key] = useContext(ModalContext);
	return useMemo(() => {
		return async <T>(
			componentExecutor: ComponentExecutor<T>,
			options?: Options,
		) =>
			dialog(componentExecutor, {
				key: key(),
				append,
				replace,
				remove,
				...options,
			});
	}, [append, remove]);
};

export default useDialog;
