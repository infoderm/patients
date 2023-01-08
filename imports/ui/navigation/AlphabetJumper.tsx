import React from 'react';

import {list} from '@iterable-iterator/list';

import TabJumper, {type Props as TabJumperProps} from './TabJumper';

// Waiting for https://github.com/microsoft/TypeScript/pulls/47607
// type Props =  Omit<PropsOf<typeof TabJumper<number>>, 'tabs' | 'number'>;
// Workaround below
type Props = Omit<TabJumperProps<string>, 'tabs'>;

export default function AlphabetJumper(props: Props) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const tabs = list(alphabet);

	return <TabJumper tabs={tabs} {...props} />;
}
