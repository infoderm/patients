import React, {type ReactNode} from 'react';
import {type UseComboboxReturnValue} from 'downshift';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';
import SearchBoxInternalsSuggestions from './SearchBoxInternalsSuggestions';

type SearchBoxWithSuggestionsInternalsProps<Item> = {
	className?: string;
	expands?: boolean;
	loading: boolean;
	placeholder?: string;
	icon?: ReactNode;
	suggestions: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => string;
} & UseComboboxReturnValue<Item>;

const SearchBoxWithSuggestionsInternals = <Item,>({
	className,
	expands = false,
	placeholder,
	icon,
	getInputProps,
	...rest
}: SearchBoxWithSuggestionsInternalsProps<Item>) => {
	return (
		<SearchBoxInternalsContainer>
			<SearchBoxInternalsInputContainer className={className}>
				{icon && (
					<SearchBoxInternalsAdornment>{icon}</SearchBoxInternalsAdornment>
				)}
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
