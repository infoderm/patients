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
		useSuggestions,
		itemToKey,
		itemToString,
		expands,
		placeholder,
		getInputProps,
		getItemProps,
		isOpen,
		inputValue,
		selectedItem,
		highlightedIndex
	} = props;

	const suggestions = useSuggestions(inputValue);

	return (
		<SearchBoxInternalsContainer>
			<SearchBoxInternalsInputContainer className={className}>
				<SearchBoxInternalsAdornment />
				<SearchBoxInternalsInput
					expands={expands}
					inputProps={{
						placeholder,
						...getInputProps()
					}}
				/>
			</SearchBoxInternalsInputContainer>
			{isOpen ? (
				<SearchBoxInternalsSuggestions
					{...{
						suggestions,
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
	useSuggestions: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	getInputProps: PropTypes.func.isRequired,
	getItemProps: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	inputValue: PropTypes.string,
	highlightedIndex: PropTypes.number,
	placeholder: PropTypes.string
};
