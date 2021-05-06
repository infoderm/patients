import React from 'react';

import {list} from '@iterable-iterator/list';

import TabJumper from './TabJumper.js';

export default function AlphabetJumper(props) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const tabs = list(alphabet);

	return <TabJumper tabs={tabs} {...props} />;
}
