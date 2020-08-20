import React from 'react';
import PropTypes from 'prop-types';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer.js';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment.js';
import SearchBoxInternalsInput from './SearchBoxInternalsInput.js';
import SearchBoxInternalsSuggestions from './SearchBoxInternalsSuggestions.js';

export default function SearchBoxWithSuggestionsInternals(props) {
	const {
		filter,
		suggestions,
		itemToKey,
		itemToString,
		placeholder,
		getInputProps,
		getItemProps,
		isOpen,
		inputValue,
		selectedItem,
		highlightedIndex
	} = props;

	return (
		<SearchBoxInternalsContainer>
			<SearchBoxInternalsAdornment />
			<SearchBoxInternalsInput
				inputProps={getInputProps()}
				placeholder={placeholder}
			/>
			{isOpen ? (
				<SearchBoxInternalsSuggestions
					suggestions={filter(suggestions, inputValue, itemToString)}
					{...{
						itemToKey,
						itemToString,
						getItemProps,
						selectedItem,
						highlightedIndex
					}}
				/>
			) : null}
		</SearchBoxInternalsContainer>
	);
}

SearchBoxWithSuggestionsInternals.propTypes = {
	suggestions: PropTypes.array.isRequired,
	filter: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	getInputProps: PropTypes.func.isRequired,
	getItemProps: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	inputValue: PropTypes.string,
	highlightedIndex: PropTypes.number,
	placeholder: PropTypes.string
};
