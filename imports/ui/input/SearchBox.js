import React from 'react';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer.js';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment.js';
import SearchBoxInternalsInput from './SearchBoxInternalsInput.js';

export default function SearchBox({className, expands, ...rest}) {
	return (
		<SearchBoxInternalsContainer className={className}>
			<SearchBoxInternalsAdornment />
			<SearchBoxInternalsInput expands={expands} inputProps={rest} />
		</SearchBoxInternalsContainer>
	);
}
