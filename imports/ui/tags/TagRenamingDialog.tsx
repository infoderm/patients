import React, {useState} from 'react';

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
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import withLazyOpening from '../modal/withLazyOpening';
import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import Endpoint from '../../api/endpoint/Endpoint';
import call from '../../api/endpoint/call';
import TagDocument from '../../api/tags/TagDocument';

const useStyles = makeStyles({
	root: {
		overflowY: 'visible',
	},
	content: {
		overflowY: 'visible',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: (name: string) => void;
	title: string;
	useTagsFind?: () => void;
	endpoint: Endpoint<unknown>;
	tag: TagDocument;
	nameKey?: string;
	nameKeyTitle?: string;
	nameFormat: (tag: TagDocument, name: string) => string;
}

const defaultUseTagsFind = () => ({results: []});
const defaultNameFormat = (_tag: TagDocument, name: string) => name;

const TagRenamingDialog = ({
	open,
	onClose,
	onRename,
	title,
	useTagsFind = defaultUseTagsFind,
	endpoint,
	tag,
	nameKey = 'name',
	nameKeyTitle = 'name',
	nameFormat = defaultNameFormat,
}: Props) => {
	const classes = useStyles();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [newname, setNewname] = useStateWithInitOverride(normalizeInput(''));
	const [newnameError, setNewnameError] = useState('');
	const [pending, setPending] = useState(false);

	const getError = (expected, value) =>
		normalized(expected) === normalized(value) ? '' : 'Names do not match';
	const {validate: validateOldName, props: ConfirmationTextFieldProps} =
		useConfirmationTextFieldState(tag[nameKey].toString(), getError);

	const Title = capitalized(title);

	const renameThisTagIfNameMatchesAndNewNameNotEmpty = async (event) => {
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
			setPending(true);
			const key = enqueueSnackbar('Processing...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(endpoint, tag._id, name);
				closeSnackbar(key);
				const message = `${Title} #${tag._id} renamed from ${nameFormat(
					tag,
					tag[nameKey],
				)} to ${nameFormat(tag, name)} (using ${endpoint.name}).`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'success'});
				onRename(name);
			} catch (error: unknown) {
				setPending(false);
				closeSnackbar(key);
				console.error(error);
				const message = error instanceof Error ? error.message : 'unknown err';
				enqueueSnackbar(message, {variant: 'error'});
			}
		}
	};

	return (
		<Dialog
			open={open}
			PaperProps={{className: classes.root}}
			onClose={onClose}
		>
			<DialogTitle>
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
						nameKey,
					)}
					TextFieldProps={{
						label: `${Title}'s new ${nameKeyTitle}`,
						margin: 'normal',
						fullWidth: true,
						helperText: newnameError,
						error: Boolean(newnameError),
					}}
					inputValue={newname}
					onInputChange={(_event, newInputValue) =>
						setNewname(normalizeInput(newInputValue))
					}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					disabled={pending}
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					disabled={pending}
					color="secondary"
					endIcon={<EditIcon />}
					onClick={renameThisTagIfNameMatchesAndNewNameNotEmpty}
				>
					Rename
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(TagRenamingDialog);
