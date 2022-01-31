import React, {useMemo, useState} from 'react';

import Endpoint from '../../api/endpoint/Endpoint';
import apply from '../../api/endpoint/apply';
import useIsMounted from '../hooks/useIsMounted';
import ConfirmationDialog, {
	ConfirmationDialogProps,
} from './ConfirmationDialog';

interface EndpointCallConfirmationDialogProps<T>
	extends Omit<ConfirmationDialogProps, 'pending' | 'onCancel' | 'onConfirm'> {
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
	const [pending, setPending] = useState(false);

	const isMounted = useIsMounted();

	const onConfirm = useMemo(() => {
		return async (event) => {
			event.preventDefault();
			setPending(true);
			try {
				await apply(endpoint, args);
				if (isMounted()) {
					setPending(false);
					onClose();
				}
			} catch (error: unknown) {
				if (isMounted()) {
					setPending(false);
				}

				console.error(error);
			}
		};
	}, [endpoint, JSON.stringify(args), onClose]);

	return (
		<ConfirmationDialog
			{...rest}
			pending={pending}
			onCancel={onClose}
			onConfirm={onConfirm}
		/>
	);
};

export default EndpointCallConfirmationDialog;
