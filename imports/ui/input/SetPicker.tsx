import React, {useEffect, useMemo, useCallback, useState} from 'react';
import {
	useCombobox,
	useMultipleSelection,
	type UseComboboxGetToggleButtonPropsOptions,
} from 'downshift';

import {any} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import DefaultChip from '@mui/material/Chip';

import makeStyles from '../styles/makeStyles';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

import TextField from './TextField';

import Suggestions from './Suggestions';
import Selection from './Selection';

const useToggleButtonStyles = makeStyles()({
	hidden: {
		display: 'none',
	},
});

type ToggleButtonProps = {
	readonly isOpen: boolean;
	readonly readOnly: boolean;
	readonly hasSuggestions: boolean;
	readonly getToggleButtonProps: (
		options?: UseComboboxGetToggleButtonPropsOptions,
	) => any;
};

const ToggleButton = ({
	isOpen,
	readOnly,
	hasSuggestions,
	getToggleButtonProps,
}: ToggleButtonProps) => {
	const {classes, cx} = useToggleButtonStyles();

	return (
		<InputAdornment position="end">
			<IconButton
				size="large"
				{...getToggleButtonProps({
					className: cx({[classes.hidden]: readOnly || !hasSuggestions}),
				})}
			>
				{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
			</IconButton>
		</InputAdornment>
	);
};

const useStyles = makeStyles()((theme) => ({
	container: {
		flexGrow: 1,
		position: 'relative',
	},
	inputRoot: {
		flexWrap: 'wrap',
	},
	inputInput: {
		margin: `${theme.spacing(1 / 2)} 0`,
		width: 'auto',
		flexGrow: 1,
	},
}));

type SetPickerProps<Item, ChipProps> = {
	readonly className?: string;
	readonly Chip?: React.ElementType;
	readonly chipProps?: ((item: Item, index: number) => ChipProps) | ChipProps;
	readonly withoutToggle?: boolean;
	readonly value: Item[];
	readonly readOnly?: boolean;
	readonly useSuggestions: (inputValue: string) => {
		loading?: boolean;
		results: any[];
	};
	readonly itemToKey: (item: Item) => React.Key;
	readonly itemToString: (item: Item) => React.ReactNode;
	readonly Item?: React.ElementType;
	readonly inputTransform?: (inputValue: string) => string;
	readonly inputValidation?: InputValidation;
	readonly onChange?: (event: any) => void | Promise<void>;
	readonly createNewItem?: (inputValue: string) => Item | undefined;
	readonly maxCount?: number;
	readonly multiset?: boolean;
	readonly TextFieldProps?: any;
	readonly InputProps?: any;
	readonly inputProps?: any;
	readonly placeholder?: string;
};

const comboboxStateReducer = (state, {type, changes}) => {
	switch (type) {
		case useCombobox.stateChangeTypes.InputChange: {
			return {
				...changes,
				highlightedIndex: -1,
			};
		}

		case useCombobox.stateChangeTypes.InputBlur: {
			return {
				...changes,
				highlightedIndex: state.highlightedIndex,
				inputValue: state.inputValue,
			};
		}

		case useCombobox.stateChangeTypes.InputKeyDownEnter:
		case useCombobox.stateChangeTypes.ItemClick: {
			return {
				...changes,
				highlightedIndex: state.highlightedIndex,
				isOpen: true,
				inputValue: '',
			};
		}

		default: {
			return changes;
		}
	}
};

const useSelectionManagement = (selectedItems, onChange) =>
	useMemo(() => {
		const setSelectedItems = async (value) => {
			await onChange({
				target: {
					value,
				},
			});
		};

		const addSelectedItem = async (item) => {
			const newValue = selectedItems.slice();
			newValue.push(item);
			await setSelectedItems(newValue);
		};

		const removeSelectedItem = async (item) => {
			await setSelectedItems(selectedItems.filter((x) => x !== item));
		};

		return {
			setSelectedItems,
			addSelectedItem,
			removeSelectedItem,
		};
	}, [selectedItems, onChange]);

type InputValidation = (inputValue: string) => {
	state: -1 | 0 | 1;
	message?: string;
};

const DEFAULT_INPUT_TRANSFORM = (x: string): string => x;
const DEFAULT_INPUT_VALIDATION: InputValidation = () => ({state: 1});

const SetPicker = <ItemType, ChipProps>({
	className,
	useSuggestions,
	itemToKey,
	itemToString,
	Item,
	Chip = DefaultChip,
	chipProps,
	withoutToggle = false,
	TextFieldProps,
	inputProps,
	InputProps,
	placeholder,
	readOnly,
	value,
	onChange,
	maxCount = Number.POSITIVE_INFINITY,
	createNewItem,
	multiset = false,
	inputTransform = DEFAULT_INPUT_TRANSFORM,
	inputValidation = DEFAULT_INPUT_VALIDATION,
}: SetPickerProps<ItemType, ChipProps>) => {
	const {classes, cx} = useStyles();

	const emptyInput = inputTransform('');

	const [inputValue, setInputValue] = useStateWithInitOverride(emptyInput);
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState<string | undefined>(undefined);

	const selectedItems = value;
	const count = selectedItems.length;
	const full = count >= maxCount;

	const inputDisabled = Boolean(readOnly) || full;

	const {setSelectedItems, addSelectedItem, removeSelectedItem} =
		useSelectionManagement(selectedItems, onChange);

	const {loading, results: suggestions} = useSuggestions(inputValue);

	const hasSuggestions = Boolean(suggestions?.length);

	const resetInputValue = useCallback(() => {
		setInputValue(emptyInput);
		setError(false);
		setHelperText(undefined);
	}, [setInputValue, emptyInput]);

	useEffect(() => {
		if (inputDisabled) resetInputValue();
	}, [inputDisabled, resetInputValue]);

	const {getSelectedItemProps, getDropdownProps} = useMultipleSelection({
		selectedItems,
		async onSelectedItemsChange({selectedItems}) {
			// This is called when hitting backspace on empty input, or when
			// pressing delete or backspace key while a chip is focused.
			if (selectedItems) await setSelectedItems(selectedItems);
		},
	});

	const isSelected = (item) => {
		const itemKey = itemToKey(item);
		return any(map((x) => x === itemKey, map(itemToKey, selectedItems)));
	};

	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		openMenu,
		selectItem,
	} = useCombobox({
		inputValue,
		selectedItem: null,
		items: suggestions,
		onInputValueChange({inputValue}) {
			if (full) {
				resetInputValue();
			} else {
				const newInputValue = inputTransform(inputValue?.trimStart() ?? '');
				if (newInputValue === emptyInput) {
					resetInputValue();
				} else {
					setInputValue(newInputValue);
					const {state, message} = inputValidation(newInputValue);
					setError(!state);
					setHelperText(message);
				}
			}
		},
		stateReducer: comboboxStateReducer,
		async onStateChange(changes) {
			const {type, selectedItem} = changes;
			if (readOnly) {
				return;
			}

			switch (type) {
				case useCombobox.stateChangeTypes.InputKeyDownEnter:
				case useCombobox.stateChangeTypes.ItemClick: {
					// This is called when an item in the suggestion list is
					// clicked or highlighted then the enter key is pressed.
					if (selectedItem !== undefined) {
						if (!multiset && isSelected(selectedItem)) {
							await removeSelectedItem(selectedItem);
						} else if (!full) {
							await addSelectedItem(selectedItem);
						}

						selectItem(null);
					}

					break;
				}

				default: {
					break;
				}
			}
		},
	});

	const maybeCreateNewItem = async () => {
		// TODO avoid creating new item before multiset check,
		// handle async item creation, use try/catch for error
		// handling
		const item = createNewItem?.(inputValue.trim());
		if (item !== undefined && (multiset || !isSelected(item))) {
			await addSelectedItem(item);
			resetInputValue();
		}
	};

	/**
	 * This is an event handler for the keyDown event on the input component.
	 * We capture enter key pressing for item creation without the need for a
	 * special suggestion item like in
	 * https://codesandbox.io/s/github/kentcdodds/downshift-examples?file=/src/downshift/ordered-examples/05-multi-create.js
	 * Maybe we will use a more complicated solution later that will not need
	 * this handler.
	 */
	const handleInputKeyDownEnter = async (event) => {
		if (
			!inputDisabled &&
			inputValue.length > 0 &&
			highlightedIndex === -1 &&
			createNewItem &&
			event.key === 'Enter'
		) {
			await maybeCreateNewItem();
		}
	};

	return (
		<div className={cx(classes.container, className)}>
			<TextField
				fullWidth
				readOnly={readOnly}
				error={error}
				helperText={helperText}
				{...TextFieldProps}
				InputLabelProps={getLabelProps()}
				inputProps={{
					...inputProps,
					readOnly: Boolean(readOnly) || full,
				}}
				InputProps={{
					...getInputProps(
						getDropdownProps({
							refKey: 'inputRef',
							onFocus: isOpen ? undefined : openMenu,
							onKeyDown: handleInputKeyDownEnter,
						}),
					),
					classes: {
						root: classes.inputRoot,
						input: classes.inputInput,
					},
					startAdornment: (
						<Selection
							readOnly={Boolean(readOnly)}
							Chip={Chip}
							chipProps={chipProps}
							selectedItems={selectedItems}
							itemToKey={itemToKey}
							itemToString={itemToString}
							getSelectedItemProps={getSelectedItemProps}
							removeSelectedItem={removeSelectedItem}
						/>
					),
					endAdornment: withoutToggle ? undefined : (
						<ToggleButton
							isOpen={isOpen}
							readOnly={Boolean(readOnly)}
							hasSuggestions={hasSuggestions}
							getToggleButtonProps={getToggleButtonProps}
						/>
					),
					placeholder: readOnly
						? count > 0
							? ''
							: placeholder
						: full
						? ''
						: placeholder,
					...InputProps,
				}}
			/>
			<Suggestions
				{...getMenuProps()}
				hide={inputDisabled || !isOpen}
				loading={loading}
				suggestions={suggestions}
				getItemProps={getItemProps}
				createNewItem={createNewItem && maybeCreateNewItem}
				inputValue={inputValue.trim()}
				error={error}
				highlightedIndex={highlightedIndex}
				selectedItems={selectedItems}
				itemToKey={itemToKey}
				itemToString={itemToString}
				Item={Item}
			/>
		</div>
	);
};

export default SetPicker;
