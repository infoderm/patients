import React from 'react';

import useAny from '../hooks/useAny';

const withLazyOpening = (Openable) => (props) => {
	const {open} = props;

	const opened = useAny(open);

	return opened ? <Openable {...props} /> : null;
};

export default withLazyOpening;
