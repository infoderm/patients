import React from 'react';
import PropTypes from 'prop-types';

import Jumper from './Jumper';

export default function TabJumper({tabs, current, toURL}) {
	const items = tabs.map((x) => ({
		key: x,
		url: toURL(x),
		disabled: x === current
	}));

	return <Jumper items={items} />;
}

TabJumper.propTypes = {
	tabs: PropTypes.array.isRequired,
	toURL: PropTypes.func.isRequired
};
