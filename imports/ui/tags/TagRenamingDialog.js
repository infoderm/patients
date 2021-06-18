import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

import {capitalized, normalized, normalizeInput} from '../../api/string';

import ConfirmationTextField, {
	useConfirmationTextFieldState
} from '../input/ConfirmationTextField';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import withLazyOpening from '../modal/withLazyOpening';
import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

const useStyles = makeStyles((theme) => ({
	root: {
		overflowY: 'visible'
	},
	content: {
		overflowY: 'visible'
	},
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const MAGIC = '8324jdkf-tag-renaming-dialog-title';
let nextAriaId = 0;

const TagRenamingDialog = (props) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [newname, setNewname] = useStateWithInitOverride(normalizeInput(''));
	const [newnameError, setNewnameError] = useState('');
	const [ariaId] = useState(`${MAGIC}-#${++nextAriaId}`);

	const {
		open,
		onClose,
		onRename,
		title,
		useTagsFind,
		method,
		tag,
		nameKey,
		nameKeyTitle,
		nameFormat
	} = props;

	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Names do not match';
	const {validate: validateOldName, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(tag[nameKey].toString(), getError);

	const Title = capitalized(title);

	const renameThisTagIfNameMatchesAndNewNameNotEmpty = (event) => {
		event.preventDefault();
		let error = !validateOldName();
		const name = newname.trim();
		if (name.length === 0) {
			setNewnameError(`The new ${nameKeyTitle} is empty.`);
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
			// component="form"
			PaperProps={{className: classes.root}}
			aria-labelledby={ariaId}
			onClose={onClose}
		>
			<DialogTitle id={ariaId}>
				Rename {title} {nameFormat(tag, tag[nameKey])}
			</DialogTitle>
			<DialogContent className={classes.content}>
				<DialogContentText>
					If you do not want to rename this {title}, click cancel. If you really
					want to rename this {title} from the system, enter the {title}&apos;s
					old name and new name below and click the rename button.
				</DialogContentText>
				<ConfirmationTextField
					autoFocus
					fullWidth
					margin="dense"
					label={`${Title}'s old ${nameKeyTitle}`}
					{...ConfirmationTextFieldProps}
				/>
				<AutocompleteWithSuggestions
					itemToString={(x) => (x ? x[nameKey] : '')}
					useSuggestions={makeSubstringSuggestions(
						useTagsFind,
						[tag[nameKey]],
						nameKey
					)}
					TextFieldProps={{
						label: `${Title}'s new ${nameKeyTitle}`,
						margin: 'normal',
						fullWidth: true,
						helperText: newnameError,
						error: Boolean(newnameError)
					}}
					inputValue={newname}
					onInputChange={(_event, newInputValue) =>
						setNewname(normalizeInput(newInputValue))
					}
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
	nameFormat: (_tag, name) => name,
	useTagsFind: () => ({results: []})
};

TagRenamingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	useTagsFind: PropTypes.func,
	method: PropTypes.string.isRequired,
	tag: PropTypes.object.isRequired,
	nameKey: PropTypes.string,
	nameKeyTitle: PropTypes.string,
	nameFormat: PropTypes.func
};

export default withLazyOpening(TagRenamingDialog);
