import React, {useMemo} from 'react';

import Endpoint from '../../api/endpoint/Endpoint';
import apply from '../../api/endpoint/apply';
import useIsMounted from '../hooks/useIsMounted';
import ConfirmationDialog, {
	ConfirmationDialogProps,
} from './ConfirmationDialog';

interface EndpointCallConfirmationDialogProps<T>
	extends Omit<ConfirmationDialogProps, 'onCancel' | 'onConfirm'> {
	endpoint: Endpoint<T>;
	args: any[];
	onClose: () => void;
}

const EndpointCallConfirmationDialog = <T,>({
	endpoint,
	args,
	onClose,
	...rest
}: EndpointCallConfirmationDialogProps<T>) => {
	const isMounted = useIsMounted();

	const onConfirm = useMemo(() => {
		return async (event) => {
			event.preventDefault();
			try {
				await apply(endpoint, args);
				if (isMounted()) {
					onClose();
				}
			} catch (error: unknown) {
				console.error(error);
			}
		};
	}, [endpoint, JSON.stringify(args), onClose]);

	return (
		<ConfirmationDialog {...rest} onCancel={onClose} onConfirm={onConfirm} />
	);
};

export default EndpointCallConfirmationDialog;
