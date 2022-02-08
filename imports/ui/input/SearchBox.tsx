import React from 'react';

import PropsOf from '../../util/PropsOf';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';

interface Props extends PropsOf<typeof SearchBoxInternalsInput> {
	className?: string;
}

const SearchBox = ({className, ...rest}: Props) => (
	<SearchBoxInternalsContainer>
		<SearchBoxInternalsInputContainer className={className}>
			<SearchBoxInternalsAdornment />
			<SearchBoxInternalsInput {...rest} />
		</SearchBoxInternalsInputContainer>
	</SearchBoxInternalsContainer>
);

export default SearchBox;
