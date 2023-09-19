import React, {useMemo} from 'react';

import type Args from '../../api/Args';
import {type Authentication} from '../../api/Authentication';
import type Endpoint from '../../api/endpoint/Endpoint';
import type Serializable from '../../api/Serializable';
import useApply from '../action/useApply';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationDialog, {
	type ConfirmationDialogProps,
} from './ConfirmationDialog';

type EndpointCallConfirmationDialogProps<
	A extends Args,
	R extends Serializable,
	Auth extends Authentication,
> = {
	readonly endpoint: Endpoint<A, R, Auth>;
	readonly args: A;
	readonly onClose: () => void;
} & Omit<ConfirmationDialogProps, 'pending' | 'onCancel' | 'onConfirm'>;

const EndpointCallConfirmationDialog = <
	A extends Args,
	R extends Serializable,
	Auth extends Authentication,
>({
	endpoint,
	args,
	onClose,
	...rest
}: EndpointCallConfirmationDialogProps<A, R, Auth>) => {
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
