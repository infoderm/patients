import React, {type ReactNode} from 'react';
import {type UseComboboxReturnValue} from 'downshift';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';
import SearchBoxInternalsSuggestions from './SearchBoxInternalsSuggestions';

type SearchBoxWithSuggestionsInternalsProps<Item> = {
	readonly className?: string;
	readonly expands?: boolean;
	readonly loading: boolean;
	readonly placeholder?: string;
	readonly icon?: ReactNode;
	readonly suggestions: Item[];
	readonly itemToKey: (item: Item) => React.Key;
	readonly itemToString: (item: Item) => string;
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
