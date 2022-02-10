import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {useCombobox, UseComboboxProps} from 'downshift';

import SearchBoxWithSuggestionsInternals from './SearchBoxWithSuggestionsInternals';

const comboboxStateReducer = (state, {type, changes}) => {
	switch (type) {
		case useCombobox.stateChangeTypes.InputChange:
			return {
				...changes,
				highlightedIndex: -1,
			};
		case useCombobox.stateChangeTypes.InputBlur:
			return {
				...changes,
				highlightedIndex: state.highlightedIndex,
				inputValue: state.inputValue,
			};
		case useCombobox.stateChangeTypes.InputKeyDownEnter:
		case useCombobox.stateChangeTypes.ItemClick:
			return {
				...changes,
				highlightedIndex: -1,
				inputValue: '',
			};
		default:
			return changes;
	}
};

type Props = {
	useSuggestions: (x: string) => {loading?: boolean; results: any[]};
	itemToKey: (x: any) => any;
	expands?: boolean;
	placeholder?: string;
	className?: string;
} & Omit<UseComboboxProps<any>, 'items'>;

export default function SearchBoxWithSuggestions(props: Props) {
	const {
		useSuggestions,
		itemToKey,
		itemToString,
		expands,
		placeholder,
		className,
		...rest
	} = props;

	const [inputValue, setInputValue] = useState('');
	const {loading, results: suggestions} = useSuggestions(inputValue);

	const internalsProps = {
		useSuggestions,
		itemToKey,
		itemToString,
		expands,
		placeholder,
		className,
		loading,
		suggestions,
	};

	const downshiftProps = useCombobox({
		items: suggestions,
		itemToString,
		inputValue,
		onInputValueChange({inputValue}) {
			setInputValue(inputValue);
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
}

SearchBoxWithSuggestions.propTypes = {
	useSuggestions: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	className: PropTypes.string,
};
