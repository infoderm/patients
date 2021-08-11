import React from 'react';
import PropTypes from 'prop-types';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';
import SearchBoxInternalsSuggestions from './SearchBoxInternalsSuggestions';

export default function SearchBoxWithSuggestionsInternals(props) {
	const {
		className,
		suggestions,
		itemToKey,
		itemToString,
		expands,
		placeholder,
		getComboboxProps,
		getInputProps,
		getMenuProps,
		getItemProps,
		isOpen,
		loading,
		selectedItem,
		highlightedIndex,
	} = props;

	return (
		<SearchBoxInternalsContainer>
			<SearchBoxInternalsInputContainer
				className={className}
				{...getComboboxProps()}
			>
				<SearchBoxInternalsAdornment />
				<SearchBoxInternalsInput
					expands={expands}
					placeholder={placeholder}
					{...getInputProps({
						refKey: 'inputRef',
					})}
				/>
			</SearchBoxInternalsInputContainer>
			<SearchBoxInternalsSuggestions
				{...{
					isOpen,
					loading,
					suggestions,
					itemToKey,
					itemToString,
					getMenuProps,
					getItemProps,
					selectedItem,
					highlightedIndex,
				}}
			/>
		</SearchBoxInternalsContainer>
	);
}

SearchBoxWithSuggestionsInternals.propTypes = {
	suggestions: PropTypes.array.isRequired,
	itemToString: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	getInputProps: PropTypes.func.isRequired,
	getItemProps: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	inputValue: PropTypes.string,
	highlightedIndex: PropTypes.number,
	placeholder: PropTypes.string,
};
