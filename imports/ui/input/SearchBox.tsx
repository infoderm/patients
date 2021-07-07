import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';

const SearchBox = ({
	className,
	...rest
}: InferProps<typeof SearchBox.propTypes>) => {
	return (
		<SearchBoxInternalsContainer>
			<SearchBoxInternalsInputContainer className={className}>
				<SearchBoxInternalsAdornment />
				<SearchBoxInternalsInput {...rest} />
			</SearchBoxInternalsInputContainer>
		</SearchBoxInternalsContainer>
	);
};

SearchBox.propTypes = {
	className: PropTypes.string,
	expands: PropTypes.bool
};

export default SearchBox;
