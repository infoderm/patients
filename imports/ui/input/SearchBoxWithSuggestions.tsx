import React from 'react';
import PropTypes from 'prop-types';

import Downshift from 'downshift';

import PropsOf from '../../util/PropsOf.js';
import SearchBoxWithSuggestionsInternals from './SearchBoxWithSuggestionsInternals.js';

type Props = {
	useSuggestions: (x: string) => {loading?: boolean; results: any[]};
	itemToKey: (x: any) => any;
	placeholder?: string;
	className?: string;
} & PropsOf<typeof Downshift>;

export default function SearchBoxWithSuggestions(props: Props) {
	const {useSuggestions, itemToKey, placeholder, className, ...rest} = props;
	const internalsProps = {
		useSuggestions,
		itemToKey,
		placeholder,
		className
	};

	return (
		<Downshift {...rest}>
			{(downshiftProps) => (
				<div>
					<SearchBoxWithSuggestionsInternals
						{...downshiftProps}
						{...internalsProps}
					/>
				</div>
			)}
		</Downshift>
	);
}

SearchBoxWithSuggestions.propTypes = {
	useSuggestions: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	className: PropTypes.string
};
