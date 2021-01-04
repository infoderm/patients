import React from 'react';
import PropTypes from 'prop-types';

import Downshift from 'downshift';

import SearchBoxWithSuggestionsInternals from './SearchBoxWithSuggestionsInternals.js';

export default function SearchBoxWithSuggestions(props) {
	const {
		useSuggestions,
		itemToKey,
		itemToString,
		placeholder,
		className,
		...rest
	} = props;
	const internalsProps = {
		useSuggestions,
		itemToKey,
		itemToString,
		placeholder,
		className
	};

	return (
		<Downshift itemToString={itemToString} {...rest}>
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
	itemToString: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	placeholder: PropTypes.string
};
