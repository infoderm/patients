import React from 'react';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer.js';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment.js';
import SearchBoxInternalsInput from './SearchBoxInternalsInput.js';

export default function SearchBox(props) {
	return (
		<SearchBoxInternalsContainer>
			<SearchBoxInternalsAdornment />
			<SearchBoxInternalsInput inputProps={props} />
		</SearchBoxInternalsContainer>
	);
}
