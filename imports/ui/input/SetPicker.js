import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';

import {all, map} from '@aureooms/js-itertools';

import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

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

function renderSuggestion({
	loading,
	suggestion,
	index,
	itemProps,
	highlightedIndex,
	selectedItem,
	itemToString,
	itemToKey
}) {
	const isHighlighted = highlightedIndex === index;
	const isSelected = selectedItem
		.map(itemToKey)
		.includes(itemToKey(suggestion));

	return (
		<MenuItem
			{...itemProps}
			key={itemToKey(suggestion)}
			selected={isHighlighted}
			disabled={loading}
			component="div"
			style={{
				fontWeight: isSelected ? 500 : 400
			}}
		>
			{itemToString(suggestion)}
		</MenuItem>
	);
}

renderSuggestion.propTypes = {
	highlightedIndex: PropTypes.number,
	index: PropTypes.number,
	itemProps: PropTypes.object,
	selectedItem: PropTypes.array.isRequired,
	suggestion: PropTypes.object.isRequired
};

const Suggestions = ({
	classes,
	useSuggestions,
	query,
	getItemProps,
	highlightedIndex,
	selectedItem,
	itemToKey,
	itemToString
}) => {
	const {loading, results} = useSuggestions(query);

	if (!results || results.length === 0) return null;

	return (
		<Paper square className={classes.paper}>
			{results.map((suggestion, index) =>
				renderSuggestion({
					loading,
					suggestion,
					index,
					itemProps: getItemProps({item: suggestion}),
					highlightedIndex,
					selectedItem,
					itemToString,
					itemToKey
				})
			)}
		</Paper>
	);
};

Suggestions.propTypes = {
	classes: PropTypes.object.isRequired,
	useSuggestions: PropTypes.func.isRequired,
	query: PropTypes.string.isRequired,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
	selectedItem: PropTypes.array.isRequired,
	itemToKey: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired
};

class SetPicker extends React.Component {
	state = {
		inputValue: ''
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.readOnly) {
			this.setState({inputValue: ''});
		}
	}

	handleKeyDown = (event) => {
		const {inputValue} = this.state;
		const {
			value,
			onChange,
			readOnly,
			itemToString,
			createNewItem,
			maxCount,
			multiset,
			sort
		} = this.props;
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
					this.highlightedIndex === null &&
					createNewItem
				) {
					const item = inputValue.trim();
					const newValue = value.slice();
					if (
						multiset ||
						all(map((x) => x !== item, map(itemToString, value)))
					) {
						newValue.push(createNewItem(item));
						if (sort) {
							sort(newValue);
						}
					}

					this.setState({
						inputValue: ''
					});

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

	handleInputChange = (event) => {
		const {value, maxCount, inputTransform} = this.props;
		if (value.length < maxCount) {
			this.setState({
				inputValue: inputTransform(event.target.value.trimStart())
			});
		} else {
			this.setState({
				inputValue: inputTransform('')
			});
		}
	};

	handleChange = (item) => {
		const {
			value,
			onChange,
			itemToString,
			maxCount,
			multiset,
			sort
		} = this.props;

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

		this.setState({
			inputValue: ''
		});

		onChange({
			target: {
				value: newValue
			}
		});
	};

	stateReducer = (state, changes) => {
		switch (changes.type) {
			case Downshift.stateChangeTypes.changeInput:
				return {
					...changes,
					highlightedIndex: null
				};
			default:
				return changes;
		}
	};

	handleStateChange = (changes, state) => {
		this.highlightedIndex = state.highlightedIndex;
	};

	handleDelete = (index) => () => {
		const {value, onChange} = this.props;
		const newValue = value.slice();
		newValue.splice(index, 1);
		onChange({
			target: {
				value: newValue
			}
		});
	};

	render() {
		const {
			value,
			classes,
			useSuggestions,
			itemToString,
			itemToKey,
			chip,
			chipProps,
			TextFieldProps,
			placeholder,
			readOnly,
			maxCount
		} = this.props;

		const {inputValue} = this.state;

		const ChipElement = chip || Chip;

		const full = value.length >= maxCount;

		return (
			<Downshift
				inputValue={inputValue}
				stateReducer={this.stateReducer}
				selectedItem={value}
				itemToString={itemToString}
				itemToKey={itemToKey}
				onChange={this.handleChange}
				onStateChange={this.handleStateChange}
			>
				{({
					getInputProps,
					getItemProps,
					isOpen,
					inputValue: inputValue2,
					selectedItem: selectedItem2,
					highlightedIndex
				}) => (
					<div className={classes.container}>
						{renderInput({
							...TextFieldProps,
							fullWidth: true,
							classes,
							inputProps: {
								readOnly: readOnly || full
							},
							InputProps: getInputProps({
								startAdornment: value.map((item, index) => (
									<ChipElement
										{...chipProps}
										key={itemToString(item)}
										tabIndex={-1}
										label={itemToString(item)}
										className={classes.chip}
										onDelete={readOnly ? null : this.handleDelete(index)}
									/>
								)),
								onChange: this.handleInputChange,
								onKeyDown: this.handleKeyDown,
								placeholder: full ? '' : placeholder
							})
						})}
						{isOpen && !full ? (
							<Suggestions
								classes={classes}
								useSuggestions={useSuggestions}
								query={inputValue2}
								getItemProps={getItemProps}
								highlightedIndex={highlightedIndex}
								selectedItem={selectedItem2}
								itemToString={itemToString}
								itemToKey={itemToKey}
							/>
						) : null}
					</div>
				)}
			</Downshift>
		);
	}
}

const styles = (theme) => ({
	container: {
		flexGrow: 1,
		position: 'relative'
	},
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0
	},
	chip: {
		margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`
	},
	inputRoot: {
		flexWrap: 'wrap'
	},
	inputInput: {
		width: 'auto',
		flexGrow: 1
	},
	divider: {
		height: theme.spacing(2)
	}
});

SetPicker.defaultProps = {
	maxCount: Infinity,
	multiset: false,
	inputTransform: (x) => x
};

SetPicker.propTypes = {
	classes: PropTypes.object.isRequired,
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

export default withStyles(styles)(SetPicker);
