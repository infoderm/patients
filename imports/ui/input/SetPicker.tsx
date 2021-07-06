import React, {useState, useEffect} from 'react';
import PropTypes, {InferProps} from 'prop-types';
import classNames from 'classnames';
import keycode from 'keycode';
import Downshift from 'downshift';

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

function renderInput(inputProps) {
	const {InputProps, classes, ref, ...other} = inputProps;

	return (
		<TextField
			InputProps={{
				inputRef: ref,
				classes: {
					root: classes.inputRoot,
					input: classes.inputInput
				},
				...InputProps
			}}
			{...other}
		/>
	);
}

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

	const [inputValue, setInputValue] = useStateWithInitOverride(
		inputTransform('')
	);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const displayedValue = sort ? sort(value.slice()) : value;
	const count = displayedValue.length;
	const full = count >= maxCount;

	const resetInputValue = () => setInputValue(inputTransform(''));

	useEffect(() => {
		if (readOnly || count >= maxCount) resetInputValue();
	}, [readOnly, count, maxCount]);

	const handleKeyDown = (event) => {
		if (readOnly) {
			return;
		}

		switch (keycode(event)) {
			case 'backspace':
				if (count > 0 && inputValue.length === 0) {
					onChange({
						target: {
							value: displayedValue.slice(0, -1)
						}
					});
				}

				break;
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
					const newValue = displayedValue.slice();
					if (
						multiset ||
						all(map((x) => x !== itemString, map(itemToString, displayedValue)))
					) {
						newValue.push(item);
						if (sort) {
							sort(newValue);
						}
					}

					resetInputValue();

					onChange({
						target: {
							value: newValue
						}
					});
				}

				break;
			default:
				break;
		}
	};

	const handleInputChange = (event) => {
		if (full) {
			resetInputValue();
		} else {
			setInputValue(inputTransform(event.target.value.trimStart()));
		}
	};

	const handleChange = (item) => {
		if (full) {
			return;
		}

		const newValue = displayedValue.slice();
		if (
			multiset ||
			all(
				map((x) => x !== itemToString(item), map(itemToString, displayedValue))
			)
		) {
			newValue.push(item);
			if (sort) {
				sort(newValue);
			}
		}

		resetInputValue();

		onChange({
			target: {
				value: newValue
			}
		});
	};

	const stateReducer = (state, changes) => {
		switch (changes.type) {
			case Downshift.stateChangeTypes.changeInput:
				return {
					...changes,
					highlightedIndex: -1
				};
			case Downshift.stateChangeTypes.keyDownEscape:
				// TODO Make it so that if isOpen was true then we stop event
				// bubbling.
				return {
					...state,
					isOpen: false
				};
			default:
				return changes;
		}
	};

	const handleStateChange = (_changes, state) => {
		setHighlightedIndex(state.highlightedIndex);
	};

	const handleDelete = (index) => () => {
		const newValue = displayedValue.slice();
		newValue.splice(index, 1);
		onChange({
			target: {
				value: newValue
			}
		});
	};

	const {loading, results: suggestions} = useSuggestions(inputValue);

	return (
		<Downshift
			inputValue={inputValue}
			stateReducer={stateReducer}
			selectedItem={displayedValue}
			itemToString={itemToString}
			onChange={handleChange}
			onStateChange={handleStateChange}
		>
			{({
				getInputProps,
				getItemProps,
				getToggleButtonProps,
				isOpen,
				selectedItem: selectedItem2,
				highlightedIndex
			}) => (
				<div className={classNames(classes.container, className)}>
					{renderInput({
						...TextFieldProps,
						fullWidth: true,
						classes,
						readOnly,
						inputProps: {
							...inputProps,
							readOnly: readOnly || full
						},
						InputProps: getInputProps({
							...InputProps,
							startAdornment: displayedValue.map((item, index) => (
								<Chip
									key={itemToString(item)}
									{...(chipProps instanceof Function
										? chipProps(item, index)
										: chipProps)}
									tabIndex={-1}
									label={itemToString(item)}
									className={classes.chip}
									onDelete={readOnly ? null : handleDelete(index)}
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
							onChange: handleInputChange,
							onKeyDown: handleKeyDown,
							placeholder: readOnly
								? count > 0
									? ''
									: placeholder
								: full
								? ''
								: placeholder
						})
					})}
					<Suggestions
						hide={!isOpen || full}
						loading={loading}
						suggestions={suggestions}
						getItemProps={getItemProps}
						highlightedIndex={highlightedIndex}
						selectedItem={selectedItem2}
						itemToKey={itemToKey}
						itemToString={itemToString}
						Item={Item}
					/>
				</div>
			)}
		</Downshift>
	);
};

SetPicker.propTypes = SetPickerPropTypes;

export default SetPicker;
