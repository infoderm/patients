import React, {useState} from 'react';
import {Mongo} from 'meteor/mongo';

import {useSnackbar} from 'notistack';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogWithVisibleOverflow from '../modal/DialogWithVisibleOverflow';

import CancelButton from '../button/CancelButton';

import {
	capitalized,
	normalizedLine,
	normalizedLineInput,
} from '../../api/string';

import ConfirmationTextField, {
	useConfirmationTextFieldState,
} from '../input/ConfirmationTextField';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import withLazyOpening from '../modal/withLazyOpening';
import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import Endpoint from '../../api/endpoint/Endpoint';
import {TagNameFields, TagMetadata} from '../../api/tags/TagDocument';
import debounceSnackbar from '../../util/debounceSnackbar';
import useCall from '../action/useCall';
import GenericQueryHook from '../../api/GenericQueryHook';
import RenameButton from '../button/RenameButton';

interface Props<T> {
	open: boolean;
	onClose: () => void;
	onRename: (name: string) => void;
	title: string;
	useTagsFind?: GenericQueryHook<T>;
	suggestionFilter?: Mongo.Selector<T>;
	endpoint: Endpoint<any>;
	tag: T;
	nameKey?: string;
	nameKeyTitle?: string;
	nameFormat?: (tag: T, name: string) => string;
	inputFormat?: (input: string) => string;
}

const defaultUseTagsFind = () => ({results: []});
const defaultNameFormat = <T,>(_tag: T, name: string) => name;

const TagRenamingDialog = <T extends TagMetadata & TagNameFields>({
	open,
	onClose,
	onRename,
	title,
	useTagsFind = defaultUseTagsFind,
	suggestionFilter = undefined,
	endpoint,
	tag,
	nameKey = 'name',
	nameKeyTitle = 'name',
	nameFormat = defaultNameFormat,
	inputFormat = normalizedLineInput,
}: Props<T>) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [newname, setNewname] = useStateWithInitOverride(inputFormat(''));
	const [newnameError, setNewnameError] = useState('');
	const [call, {pending}] = useCall();
	const [renamed, setRenamed] = useState(false);

	const getError = (expected, value) =>
		normalizedLine(expected) === normalizedLine(value)
			? ''
			: 'Names do not match';
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
			const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			feedback('Processing...', {
				variant: 'info',
				persist: true,
			});
			try {
				await call(endpoint, tag._id, name);
				setRenamed(true);
				const message = `${Title} #${tag._id} renamed from ${nameFormat(
					tag,
					tag[nameKey],
				)} to ${nameFormat(tag, name)} (using ${endpoint.name}).`;
				console.log(message);
				feedback(message, {variant: 'success'});
				onRename(name);
			} catch (error: unknown) {
				console.error(error);
				const message = error instanceof Error ? error.message : 'unknown err';
				feedback(message, {variant: 'error'});
			}
		}
	};

	return (
		<DialogWithVisibleOverflow open={open} onClose={onClose}>
			<DialogTitle>
				Rename {title} {nameFormat(tag, tag[nameKey])}
			</DialogTitle>
			<DialogContent>
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
						suggestionFilter,
					)}
					TextFieldProps={{
						label: `${Title}'s new ${nameKeyTitle}`,
						margin: 'normal',
						fullWidth: true,
						helperText: newnameError,
						error: Boolean(newnameError),
					}}
					inputValue={newname}
					onInputChange={(_event, newInputValue) => {
						setNewname(inputFormat(newInputValue));
					}}
				/>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending || renamed} onClick={onClose} />
				<RenameButton
					disabled={renamed}
					loading={pending}
					color="secondary"
					onClick={renameThisTagIfNameMatchesAndNewNameNotEmpty}
				/>
			</DialogActions>
		</DialogWithVisibleOverflow>
	);
};

export default withLazyOpening(TagRenamingDialog);
