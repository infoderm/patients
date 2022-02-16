import React from 'react';
import {UseComboboxReturnValue} from 'downshift';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';
import SearchBoxInternalsSuggestions from './SearchBoxInternalsSuggestions';

interface SearchBoxWithSuggestionsInternalsProps<Item>
	extends UseComboboxReturnValue<Item> {
	className?: string;
	expands?: boolean;
	loading: boolean;
	placeholder?: string;
	suggestions: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => string;
}

const SearchBoxWithSuggestionsInternals = <Item,>({
	className,
	expands = false,
	placeholder,
	getComboboxProps,
	getInputProps,
	...rest
}: SearchBoxWithSuggestionsInternalsProps<Item>) => {
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
			<SearchBoxInternalsSuggestions {...rest} />
		</SearchBoxInternalsContainer>
	);
};

export default SearchBoxWithSuggestionsInternals;
