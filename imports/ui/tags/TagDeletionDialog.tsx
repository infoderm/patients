import React from 'react';

import {useSnackbar} from 'notistack';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {capitalized, normalizedLine} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

import DeleteButton from '../button/DeleteButton';
import CancelButton from '../button/CancelButton';

import type Endpoint from '../../api/endpoint/Endpoint';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import useCall from '../action/useCall';
import {type TagMetadata, type TagNameFields} from '../../api/tags/TagDocument';

type Props<T> = {
	open: boolean;
	onClose: () => void;
	title: string;
	endpoint: Endpoint<[string], any>;
	tag: T;
	nameKey?: string;
	nameKeyTitle?: string;
};

const TagDeletionDialog = <T extends TagMetadata & TagNameFields>({
	open,
	onClose,
	title,
	endpoint,
	tag,
	nameKey = 'name',
	nameKeyTitle = 'name',
}: Props<T>) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();

	const getError = (expected, value) =>
		normalizedLine(expected) === normalizedLine(value)
			? ''
			: 'Names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(tag[nameKey], getError);

	const Title = capitalized(title);

	const isMounted = useIsMounted();

	const deleteThisTagIfNameMatches = async (event) => {
		event.preventDefault();
		if (validate()) {
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {
				variant: 'info',
				persist: true,
			});

			try {
				await call(endpoint, tag._id);
				const message = `${Title} #${tag._id} deleted (using ${endpoint.name}).`;
				console.log(message);
				feedback(message, {variant: 'success'});
				if (isMounted()) onClose();
			} catch (error: unknown) {
				console.error(error);
				const message =
					error instanceof Error ? error.message : 'unknown error';
				feedback(message, {variant: 'error'});
			}
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				Delete {title} {tag[nameKey]}
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
					label={`${Title}'s ${nameKeyTitle}`}
					{...ConfirmationTextFieldProps}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<DeleteButton
					loading={pending}
					disabled={ConfirmationTextFieldProps.error}
					onClick={deleteThisTagIfNameMatches}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(TagDeletionDialog);
