import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer.js';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment.js';
import SearchBoxInternalsInput from './SearchBoxInternalsInput.js';

const SearchBox = ({
	className,
	expands,
	...rest
}: InferProps<typeof SearchBox.propTypes>) => {
	return (
		<SearchBoxInternalsContainer className={className}>
			<SearchBoxInternalsAdornment />
			<SearchBoxInternalsInput expands={expands} inputProps={rest} />
		</SearchBoxInternalsContainer>
	);
};

SearchBox.propTypes = {
	className: PropTypes.string,
	expands: PropTypes.bool
};

export default SearchBox;
