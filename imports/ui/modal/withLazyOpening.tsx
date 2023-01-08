import React from 'react';
import type PropsOf from '../../util/PropsOf';

import useAny from '../hooks/useAny';

const withLazyOpening =
	(Openable: React.ElementType) => (props: PropsOf<typeof Openable>) => {
		const {open} = props;

		const opened = useAny(open);

		return opened ? <Openable {...props} /> : null;
	};

export default withLazyOpening;
