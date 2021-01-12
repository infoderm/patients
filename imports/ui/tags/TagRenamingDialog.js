import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

import {capitalized, normalized} from '../../api/string.js';
import MeteorSimpleAutoCompleteTextField from '../input/MeteorSimpleAutoCompleteTextField.js';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const MAGIC = '8324jdkf-tag-renaming-dialog-title';
let nextAriaId = 0;

const TagRenamingDialog = (props) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [oldname, setOldname] = useState('');
	const [oldnameError, setOldnameError] = useState('');
	const [newname, setNewname] = useState('');
	const [newnameError, setNewnameError] = useState('');
	const [ariaId] = useState(`${MAGIC}-#${++nextAriaId}`);

	const {
		open,
		onClose,
		onRename,
		title,
		collection,
		subscription,
		method,
		tag,
		nameKey,
		nameKeyTitle,
		nameFormat
	} = props;

	const Title = capitalized(title);

	const renameThisTagIfNameMatchesAndNewNameNotEmpty = (event) => {
		event.preventDefault();
		let error = false;
		if (normalized(oldname) !== normalized(tag[nameKey].toString())) {
			setOldnameError('Names do not match');
			error = true;
		} else {
			setOldnameError('');
		}

		const name = newname.trim();
		if (name.length === 0) {
			setNewnameError(`The new ${nameKeyTitle} is empty`);
			error = true;
		} else {
			setNewnameError('');
		}

		if (!error) {
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: true
			});
			Meteor.call(method, tag._id, name, (err, _res) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `${Title} #${tag._id} renamed from ${nameFormat(
						tag,
						tag[nameKey]
					)} to ${nameFormat(tag, name)} (using ${method}).`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					onRename(name);
				}
			});
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
				Rename {title} {nameFormat(tag, tag[nameKey])}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to rename this {title}, click cancel. If you really
					want to rename this {title} from the system, enter the {title}&apos;s
					old name and new name below and click the rename button.
				</DialogContentText>
				<TextField
					autoFocus
					fullWidth
					margin="dense"
					label={`${Title}'s old ${nameKeyTitle}`}
					value={oldname}
					helperText={oldnameError}
					error={Boolean(oldnameError)}
					onChange={(e) => setOldname(e.target.value)}
				/>
				<MeteorSimpleAutoCompleteTextField
					subscription={subscription}
					collection={collection}
					selector={{[nameKey]: {$ne: tag[nameKey]}}}
					stringify={(tag) => tag[nameKey]}
					textFieldProps={{
						margin: 'dense',
						label: `${Title}'s new ${nameKeyTitle}`,
						fullWidth: true,
						value: newname,
						onChange: (e) => setNewname(e.target.value),
						helperText: newnameError,
						error: Boolean(newnameError)
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					color="secondary"
					onClick={renameThisTagIfNameMatchesAndNewNameNotEmpty}
				>
					Rename
					<EditIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

TagRenamingDialog.defaultProps = {
	nameKey: 'name',
	nameKeyTitle: 'name',
	nameFormat: (_tag, name) => name
};

TagRenamingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	collection: PropTypes.object.isRequired,
	subscription: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	tag: PropTypes.object.isRequired,
	nameKey: PropTypes.string,
	nameKeyTitle: PropTypes.string,
	nameFormat: PropTypes.func
};

export default TagRenamingDialog;
