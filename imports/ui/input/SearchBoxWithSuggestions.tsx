import React, {useState} from 'react';

import {useCombobox, type UseComboboxProps} from 'downshift';

import SearchBoxWithSuggestionsInternals from './SearchBoxWithSuggestionsInternals';

const comboboxStateReducer = (state, {type, changes}) => {
	switch (type) {
		case useCombobox.stateChangeTypes.InputChange: {
			return {
				...changes,
				highlightedIndex: -1,
			};
		}

		case useCombobox.stateChangeTypes.InputBlur: {
			return {
				...changes,
				highlightedIndex: state.highlightedIndex,
				inputValue: state.inputValue,
			};
		}

		case useCombobox.stateChangeTypes.InputKeyDownEnter:
		case useCombobox.stateChangeTypes.ItemClick: {
			return {
				...changes,
				highlightedIndex: -1,
				inputValue: '',
			};
		}

		default: {
			return changes;
		}
	}
};

type SearchBoxWithSuggestionsProps<Item> = {
	readonly useSuggestions: (x: string) => {loading?: boolean; results: Item[]};
	readonly itemToKey: (x: Item) => React.Key;
	readonly itemToString: (x: Item | null) => string;
	readonly expands?: boolean;
	readonly placeholder?: string;
	readonly icon?: React.ReactNode;
	readonly className?: string;
} & Omit<
	UseComboboxProps<Item>,
	| 'items'
	| 'inputValue'
	| 'onInputValueChange'
	| 'stateReducer'
	| 'itemToString'
>;

const SearchBoxWithSuggestions = <Item,>({
	useSuggestions,
	itemToKey,
	itemToString,
	expands,
	placeholder,
	icon,
	className,
	...rest
}: SearchBoxWithSuggestionsProps<Item>) => {
	const [inputValue, setInputValue] = useState('');
	const {loading, results: suggestions} = useSuggestions(inputValue);

	const internalsProps = {
		className,
		expands,
		loading: Boolean(loading),
		placeholder,
		icon,
		suggestions,
		itemToKey,
		itemToString,
	};

	const downshiftProps = useCombobox({
		items: suggestions,
		itemToString,
		inputValue,
		onInputValueChange({inputValue}) {
			setInputValue(inputValue ?? '');
		},
		stateReducer: comboboxStateReducer,
		...rest,
	});

	return (
		<SearchBoxWithSuggestionsInternals
			{...downshiftProps}
			{...internalsProps}
		/>
	);
};

export default SearchBoxWithSuggestions;
