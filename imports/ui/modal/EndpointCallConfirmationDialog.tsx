import React, {useMemo} from 'react';

import type Endpoint from '../../api/endpoint/Endpoint';
import useApply from '../action/useApply';
import useIsMounted from '../hooks/useIsMounted';
import ConfirmationDialog, {
	type ConfirmationDialogProps,
} from './ConfirmationDialog';

type EndpointCallConfirmationDialogProps<T> = {
	endpoint: Endpoint<T>;
	args: any[];
	onClose: () => void;
} & Omit<ConfirmationDialogProps, 'pending' | 'onCancel' | 'onConfirm'>;

const EndpointCallConfirmationDialog = <T,>({
	endpoint,
	args,
	onClose,
	...rest
}: EndpointCallConfirmationDialogProps<T>) => {
	const [apply, {pending}] = useApply();

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
	}, [apply, endpoint, JSON.stringify(args), onClose]);

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
