import React from 'react';

import useOpened from './useOpened.js';

const withLazyOpening = (Openable) => (props) => {
	const {open} = props;

	const opened = useOpened(open);

	return opened ? <Openable {...props} /> : null;
};

export default withLazyOpening;
