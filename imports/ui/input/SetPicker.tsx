import React, {useEffect} from 'react';
import PropTypes, {InferProps} from 'prop-types';
import classNames from 'classnames';
import keycode from 'keycode';
import {useCombobox, useMultipleSelection} from 'downshift';

import {all} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';

import {makeStyles, createStyles} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import DefaultChip from '@material-ui/core/Chip';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import TextField from './TextField';

import Suggestions from './Suggestions';

const styles = (theme) =>
	createStyles({
		container: {
			flexGrow: 1,
			position: 'relative'
		},
		chip: {
			margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`
		},
		inputRoot: {
			flexWrap: 'wrap'
		},
		inputInput: {
			margin: `${theme.spacing(1) / 2}px 0`,
			width: 'auto',
			flexGrow: 1
		},
		divider: {
			height: theme.spacing(2)
		},
		hidden: {
			display: 'none'
		}
	});

const useStyles = makeStyles(styles);

const SetPickerPropTypes = {
	className: PropTypes.string,
	Chip: PropTypes.elementType,
	chipProps: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	withoutToggle: PropTypes.bool,
	value: PropTypes.array.isRequired,
	readOnly: PropTypes.bool,
	useSuggestions: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired,
	Item: PropTypes.elementType,
	inputTransform: PropTypes.func,
	onChange: PropTypes.func,
	sort: PropTypes.func,
	createNewItem: PropTypes.func,
	maxCount: PropTypes.number,
	multiset: PropTypes.bool,
	TextFieldProps: PropTypes.object,
	InputProps: PropTypes.object,
	inputProps: PropTypes.object,
	placeholder: PropTypes.string
};

type SetPickerProps = InferProps<typeof SetPickerPropTypes>;

const SetPicker = (props: SetPickerProps) => {
	const {
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
		sort,
		inputTransform = (x: string): string => x
	} = props;

	const classes = useStyles();

	const emptyInput = inputTransform('');

	const [inputValue, setInputValue] = useStateWithInitOverride(emptyInput);

	const setSelectedItems = (value) => {
		onChange({
			target: {
				value
			}
		});
	};

	const addSelectedItem = (item) => {
		const newValue = selectedItems.slice();
		newValue.push(item);
		if (sort) {
			sort(newValue);
		}

		setSelectedItems(newValue);
	};

	const removeSelectedItem = (item) => {
		setSelectedItems(selectedItems.filter((x) => x !== item));
	};

	const handleDelete = (index) => () => {
		removeSelectedItem(selectedItems[index]);
	};

	const {loading, results: suggestions} = useSuggestions(inputValue);

	const resetInputValue = () => setInputValue(emptyInput);

	const selectedItems = sort ? sort(value.slice()) : value;
	const count = selectedItems.length;
	const full = count >= maxCount;

	const {getSelectedItemProps, getDropdownProps} = useMultipleSelection({
		selectedItems,
		onSelectedItemsChange: ({selectedItems}) => {
			if (selectedItems) setSelectedItems(selectedItems);
		}
	});

	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		getComboboxProps,
		highlightedIndex,
		getItemProps,
		openMenu,
		selectItem
	} = useCombobox({
		inputValue,
		selectedItem: null,
		items: suggestions,
		onInputValueChange: ({inputValue}) => {
			if (full) {
				resetInputValue();
			} else {
				setInputValue(inputTransform(inputValue.trimStart()));
			}
		},
		stateReducer: (state, {type, changes}) => {
			switch (type) {
				case useCombobox.stateChangeTypes.InputChange:
					return {
						...changes,
						highlightedIndex: -1
					};
				case useCombobox.stateChangeTypes.InputBlur:
					return {
						...changes,
						highlightedIndex: state.highlightedIndex
					};
				case useCombobox.stateChangeTypes.InputKeyDownEnter:
				case useCombobox.stateChangeTypes.ItemClick:
					return {
						...changes,
						highlightedIndex: state.highlightedIndex,
						isOpen: true
					};
				case useCombobox.stateChangeTypes.InputKeyDownEscape:
					// TODO Make it so that if isOpen was true then we stop event
					// bubbling.
					return {
						...changes,
						isOpen: false
					};
				default:
					return changes;
			}
		},
		onStateChange: (changes) => {
			console.debug(changes);
			const {type, selectedItem} = changes;
			if (readOnly) {
				return;
			}

			switch (type) {
				case useCombobox.stateChangeTypes.InputKeyDownEnter:
				case useCombobox.stateChangeTypes.ItemClick:
					if (selectedItem !== undefined) {
						if (selectedItems.includes(selectedItem)) {
							removeSelectedItem(selectedItem);
						} else if (
							!full &&
							(multiset ||
								all(
									map(
										(x) => x !== itemToString(selectedItem),
										map(itemToString, selectedItems)
									)
								))
						) {
							addSelectedItem(selectedItem);
						}

						selectItem(null);
					}

					break;
				default:
					break;
			}
		}
	});

	/**
	 * This is an event handler for the keyDown event on the input component.
	 * We capture enter key pressing for item creation without the need for a
	 * special suggestion item like in
	 * https://codesandbox.io/s/github/kentcdodds/downshift-examples?file=/src/downshift/ordered-examples/05-multi-create.js
	 * Maybe we will use a more complicated solution later that will not need
	 * this handler.
	 */
	const handleInputKeyDownEnter = (event) => {
		if (readOnly) {
			return;
		}

		switch (keycode(event)) {
			case 'enter':
				if (
					inputValue.length > 0 &&
					!full &&
					highlightedIndex === -1 &&
					createNewItem
				) {
					// TODO avoid creating new item before multiset check,
					// handle async item creation, use try/catch for error
					// handling
					const item = createNewItem(inputValue.trim());
					if (item === undefined) break;
					const itemString = itemToString(item);
					if (
						multiset ||
						all(map((x) => x !== itemString, map(itemToString, selectedItems)))
					) {
						addSelectedItem(item);
						resetInputValue();
					}
				}

				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (readOnly || full) resetInputValue();
	}, [readOnly, full]);

	return (
		<div className={classNames(classes.container, className)}>
			<TextField
				fullWidth
				readOnly={readOnly}
				{...getComboboxProps()}
				{...TextFieldProps}
				InputLabelProps={getLabelProps()}
				inputProps={{
					...inputProps,
					readOnly: readOnly || full
				}}
				InputProps={{
					...getInputProps(
						getDropdownProps({
							refKey: 'inputRef',
							onClick: isOpen ? undefined : openMenu,
							onFocus: isOpen ? undefined : openMenu,
							onKeyDown: handleInputKeyDownEnter
						})
					),
					classes: {
						root: classes.inputRoot,
						input: classes.inputInput
					},
					startAdornment: selectedItems.map((item, index) => (
						<Chip
							key={itemToString(item)}
							{...(chipProps instanceof Function
								? chipProps(item, index)
								: chipProps)}
							tabIndex={-1}
							label={itemToString(item)}
							className={classes.chip}
							onDelete={readOnly ? undefined : handleDelete(index)}
							{...getSelectedItemProps({selectedItem: item, index})}
						/>
					)),
					endAdornment: withoutToggle ? undefined : (
						<InputAdornment position="end">
							<IconButton
								className={classNames({
									[classes.hidden]: readOnly || !suggestions?.length
								})}
								{...getToggleButtonProps()}
							>
								{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</IconButton>
						</InputAdornment>
					),
					placeholder: readOnly
						? count > 0
							? ''
							: placeholder
						: full
						? ''
						: placeholder,
					...InputProps
				}}
			/>
			<Suggestions
				{...getMenuProps()}
				hide={!isOpen || full}
				loading={loading}
				suggestions={suggestions}
				getItemProps={getItemProps}
				highlightedIndex={highlightedIndex}
				selectedItems={selectedItems}
				itemToKey={itemToKey}
				itemToString={itemToString}
				Item={Item}
			/>
		</div>
	);
};

SetPicker.propTypes = SetPickerPropTypes;

export default SetPicker;
