import React, {useState} from 'react';

import {styled} from '@mui/material/styles';
import {useSnackbar} from 'notistack';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import EditIcon from '@mui/icons-material/Edit';

import CancelButton from '../button/CancelButton';

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
import debounceSnackbar from '../../util/debounceSnackbar';

const PREFIX = 'TagRenamingDialog';

const classes = {
	root: `${PREFIX}-root`,
	content: `${PREFIX}-content`,
};

const StyledDialog = styled(Dialog)({
	[`& .${classes.root}`]: {
		overflowY: 'visible',
	},
	[`& .${classes.content}`]: {
		overflowY: 'visible',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: (name: string) => void;
	title: string;
	useTagsFind?: () => void;
	endpoint: Endpoint<void>;
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
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(endpoint, tag._id, name);
				const message = `${Title} #${tag._id} renamed from ${nameFormat(
					tag,
					tag[nameKey],
				)} to ${nameFormat(tag, name)} (using ${endpoint.name}).`;
				console.log(message);
				feedback(message, {variant: 'success'});
				onRename(name);
			} catch (error: unknown) {
				setPending(false);
				console.error(error);
				const message = error instanceof Error ? error.message : 'unknown err';
				feedback(message, {variant: 'error'});
			}
		}
	};

	return (
		<StyledDialog
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
				<CancelButton disabled={pending} onClick={onClose} />
				<Button
					disabled={pending}
					color="secondary"
					endIcon={<EditIcon />}
					onClick={renameThisTagIfNameMatchesAndNewNameNotEmpty}
				>
					Rename
				</Button>
			</DialogActions>
		</StyledDialog>
	);
};

export default withLazyOpening(TagRenamingDialog);
