import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {useSnackbar} from 'notistack';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {capitalized, normalized} from '../../api/string';
import withLazyOpening from '../modal/withLazyOpening';
import useIsMounted from '../hooks/useIsMounted';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';

const MAGIC = '8324jdkf-tag-deletion-dialog-title';
let nextAriaId = 0;

const TagDeletionDialog = (props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [ariaId] = useState(`${MAGIC}-#${++nextAriaId}`);

	const {open, onClose, title, method, tag} = props;

	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Names do not match';

	const {validate, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(tag.name, getError);

	const Title = capitalized(title);

	const isMounted = useIsMounted();

	const deleteThisTagIfNameMatches = (event) => {
		event.preventDefault();
		if (validate()) {
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: true,
			});
			Meteor.call(method, tag._id, (err, _res) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `${Title} #${tag._id} deleted (using ${method}).`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					if (isMounted()) onClose();
				}
			});
		}
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby={ariaId}
			onClose={onClose}
		>
			<DialogTitle id={ariaId}>
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
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					disabled={ConfirmationTextFieldProps.error}
					color="secondary"
					endIcon={<DeleteIcon />}
					onClick={deleteThisTagIfNameMatches}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

TagDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	tag: PropTypes.object.isRequired,
};

export default withLazyOpening(TagDeletionDialog);
