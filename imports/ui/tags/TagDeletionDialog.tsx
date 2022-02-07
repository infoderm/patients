import React from 'react';

import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {capitalized, normalized} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import DeleteButton from '../button/DeleteButton';
import CancelButton from '../button/CancelButton';

import call from '../../api/endpoint/call';
import Endpoint from '../../api/endpoint/Endpoint';

interface Props {
	open: boolean;
	onClose: () => void;
	title: string;
	endpoint: Endpoint<unknown>;
	tag: {
		_id: string;
		name: string;
	};
}

const TagDeletionDialog = ({open, onClose, title, endpoint, tag}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(tag.name, getError);

	const Title = capitalized(title);

	const isMounted = useIsMounted();

	const deleteThisTagIfNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: true,
			});

			try {
				await call(endpoint, tag._id);
				closeSnackbar(key);
				const message = `${Title} #${tag._id} deleted (using ${endpoint.name}).`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				closeSnackbar(key);
				console.error(error);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				enqueueSnackbar(message, {variant: 'error'});
			}
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				Delete {title} {tag.name}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to delete this {title}, click cancel. If you really
					want to delete this {title} from the system, enter the {title}&apos;s
					name below and click the delete button.
				</DialogContentText>
				<ConfirmationTextField
					autoFocus
					fullWidth
					margin="dense"
					label={`${Title}'s name`}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<DeleteButton
					disabled={ConfirmationTextFieldProps.error}
					onClick={deleteThisTagIfNameMatches}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(TagDeletionDialog);
