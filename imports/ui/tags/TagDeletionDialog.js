import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {capitalized, normalized} from '../../api/string.js';
import withLazyOpening from '../modal/withLazyOpening.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const MAGIC = '8324jdkf-tag-deletion-dialog-title';
let nextAriaId = 0;

const TagDeletionDialog = (props) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');
	const [ariaId] = useState(`${MAGIC}-#${++nextAriaId}`);

	const {open, onClose, title, method, tag} = props;

	const Title = capitalized(title);

	const deleteThisTagIfNameMatches = (event) => {
		event.preventDefault();
		if (normalized(name) === normalized(tag.name)) {
			setNameError('');
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: 'true'
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
					onClose();
				}
			});
		} else {
			setNameError('Names do not match');
		}
	};

	return (
		<Dialog
			open={open}
			component="form"
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
				<TextField
					autoFocus
					fullWidth
					margin="dense"
					label={`${Title}'s name`}
					value={name}
					helperText={nameError}
					error={Boolean(nameError)}
					onChange={(e) => setName(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button color="secondary" onClick={deleteThisTagIfNameMatches}>
					Delete
					<DeleteIcon className={classes.rightIcon} />
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
	tag: PropTypes.object.isRequired
};

export default withLazyOpening(TagDeletionDialog);
