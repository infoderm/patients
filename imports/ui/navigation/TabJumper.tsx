import React, {Key} from 'react';

import Jumper from './Jumper';

export interface Props<K> {
	tabs: K[];
	current: K;
	toURL: (tab: K) => string;
}

const TabJumper = <K extends Key>({tabs, current, toURL}: Props<K>) => {
	const items = tabs.map((x) => ({
		key: x,
		url: toURL(x),
		disabled: x === current,
	}));

	return <Jumper items={items} />;
};

export default TabJumper;
