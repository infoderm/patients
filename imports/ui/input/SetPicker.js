import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keycode from 'keycode';
import Downshift from 'downshift';

import {all, map} from '@aureooms/js-itertools';

import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import Chip from '@material-ui/core/Chip';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride.js';

import Suggestions from './Suggestions.js';

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

const styles = (theme) => ({
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

const SetPicker = (props) => {
	const {
		className,
		useSuggestions,
		itemToString,
		itemToKey,
		Chip,
		chipProps,
		withoutToggle,
		TextFieldProps,
		inputProps,
		InputProps,
		placeholder,
		readOnly,
		value,
		onChange,
		maxCount,
		createNewItem,
		multiset,
		sort,
		inputTransform
	} = props;

	const classes = useStyles();

	const [inputValue, setInputValue] = useStateWithInitOverride(
		inputTransform('')
	);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const count = value.length;
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
				if (value.length > 0 && inputValue.length === 0) {
					onChange({
						target: {
							value: value.slice(0, -1)
						}
					});
				}

				break;
			case 'enter':
				if (
					inputValue.length > 0 &&
					value.length < maxCount &&
					highlightedIndex === -1 &&
					createNewItem
				) {
					// TODO avoid creating new item before multiset check
					// and/or handle item creation failure
					const item = createNewItem(inputValue.trim());
					const itemString = itemToString(item);
					const newValue = value.slice();
					if (
						multiset ||
						all(map((x) => x !== itemString, map(itemToString, value)))
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
		if (value.length < maxCount) {
			setInputValue(inputTransform(event.target.value.trimStart()));
		} else {
			resetInputValue();
		}
	};

	const handleChange = (item) => {
		if (value.length >= maxCount) {
			return;
		}

		const newValue = value.slice();
		if (
			multiset ||
			all(map((x) => x !== itemToString(item), map(itemToString, value)))
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
			default:
				return changes;
		}
	};

	const handleStateChange = (changes, state) => {
		setHighlightedIndex(state.highlightedIndex);
	};

	const handleDelete = (index) => () => {
		const newValue = value.slice();
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
			selectedItem={value}
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
						inputProps: {
							...inputProps,
							readOnly: readOnly || full
						},
						InputProps: getInputProps({
							...InputProps,
							startAdornment: value.map((item, index) => (
								<Chip
									{...(chipProps instanceof Function
										? chipProps(item, index)
										: chipProps)}
									key={itemToString(item)}
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
							placeholder: full ? '' : placeholder
						})
					})}
					<Suggestions
						hide={!isOpen || full}
						loading={loading}
						suggestions={suggestions}
						getItemProps={getItemProps}
						highlightedIndex={highlightedIndex}
						selectedItem={selectedItem2}
						itemToString={itemToString}
						itemToKey={itemToKey}
					/>
				</div>
			)}
		</Downshift>
	);
};

SetPicker.defaultProps = {
	Chip,
	maxCount: Number.POSITIVE_INFINITY,
	multiset: false,
	inputTransform: (x) => x
};

SetPicker.propTypes = {
	Chip: PropTypes.elementType,
	withoutToggle: PropTypes.bool,
	value: PropTypes.array.isRequired,
	useSuggestions: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired,
	inputTransform: PropTypes.func,
	onChange: PropTypes.func,
	sort: PropTypes.func,
	createNewItem: PropTypes.func,
	maxCount: PropTypes.number,
	multiset: PropTypes.bool
};

export default SetPicker;
