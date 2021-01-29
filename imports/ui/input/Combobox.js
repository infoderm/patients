import React from 'react';
import PropTypes from 'prop-types';
import {useCombobox} from 'downshift';
import keycode from 'keycode';

import {makeStyles} from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import Suggestions from './Suggestions.js';

const styles = () => ({
	root: {
		position: 'relative'
	}
});

const useStyles = makeStyles(styles);

const Combobox = ({
	itemToKey,
	itemToString,
	useSuggestions,
	TextFieldProps,
	value,
	onChange,
	inputValue,
	onInputChange
}) => {
	const classes = useStyles();

	const onInputValueChange =
		onInputChange &&
		((event) => {
			console.debug('onInputValueChange', {event});
			return onInputChange(event, event.inputValue);
		});

	const onSelectedItemChange =
		onChange &&
		((event) => {
			console.debug('onSelectedItemChange', {event});
			return onChange(event, event.selectedItem);
		});

	const onStateChange = (event) => {
		console.debug('onStateChange', {event});
	};

	const onKeyDown = (event) => {
		switch (keycode(event)) {
			case 'home':
			case 'end':
				// Prevent Downshift's default behavior.
				event.nativeEvent.preventDownshiftDefault = true;
				break;
			default:
				break;
		}
	};

	// input MUST be a control prop since we need it to retrieve suggestions
	const {loading, results: items} = useSuggestions(inputValue);

	const {
		isOpen,
		selectedItem,
		getToggleButtonProps,
		// getLabelProps,
		getMenuProps,
		getInputProps,
		getComboboxProps,
		highlightedIndex,
		getItemProps
	} = useCombobox({
		inputValue,
		selectedItem: value,
		items,
		itemToString,
		onInputValueChange,
		onSelectedItemChange,
		onStateChange
	});

	return (
		<div className={classes.root}>
			<TextField
				{...TextFieldProps}
				{...getComboboxProps()}
				InputProps={{
					inputProps: getInputProps({onKeyDown}),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton {...getToggleButtonProps()}>
								{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
			<Suggestions
				{...getMenuProps()}
				hide={!isOpen}
				loading={loading}
				suggestions={items}
				getItemProps={getItemProps}
				highlightedIndex={highlightedIndex}
				selectedItem={selectedItem}
				itemToString={itemToString}
				itemToKey={itemToKey}
			/>
		</div>
	);
};

Combobox.defaultProps = {
	itemToKey: (x) => x,
	itemToString: (x) => x,
	inputTransform: (x) => x
};

Combobox.propTypes = {
	itemToKey: PropTypes.func,
	itemToString: PropTypes.func,
	inputTransform: PropTypes.func
};

export default Combobox;
