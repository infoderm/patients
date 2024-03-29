import React, {type Key} from 'react';

import Jumper from './Jumper';

export type Props<K> = {
	readonly tabs: K[];
	readonly current?: K;
	readonly toURL: (tab: K) => string;
};

const TabJumper = <K extends Key>({tabs, current, toURL}: Props<K>) => {
	const items = tabs.map((x) => ({
		key: x,
		url: toURL(x),
		disabled: x === current,
	}));

	return <Jumper items={items} />;
};

export default TabJumper;
