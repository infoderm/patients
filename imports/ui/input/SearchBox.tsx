import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';

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
