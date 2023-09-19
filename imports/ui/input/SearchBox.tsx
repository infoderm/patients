import React from 'react';

import type PropsOf from '../../lib/types/PropsOf';

import SearchBoxInternalsContainer from './SearchBoxInternalsContainer';
import SearchBoxInternalsInputContainer from './SearchBoxInternalsInputContainer';
import SearchBoxInternalsAdornment from './SearchBoxInternalsAdornment';
import SearchBoxInternalsInput from './SearchBoxInternalsInput';

type Props = {
	readonly className?: string;
	readonly icon: React.ReactNode;
} & PropsOf<typeof SearchBoxInternalsInput>;

const SearchBox = ({className, icon, ...rest}: Props) => (
	<SearchBoxInternalsContainer>
		<SearchBoxInternalsInputContainer className={className}>
			<SearchBoxInternalsAdornment>{icon}</SearchBoxInternalsAdornment>
			<SearchBoxInternalsInput {...rest} />
		</SearchBoxInternalsInputContainer>
	</SearchBoxInternalsContainer>
);

export default SearchBox;
