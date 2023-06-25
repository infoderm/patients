import React from 'react';
import {Route, Routes} from 'react-router-dom';

import type PropsOf from '../../lib/types/PropsOf';

import {myEncodeURIComponent} from '../../lib/uri';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import NoMatch from '../navigation/NoMatch';

import TagList from './TagList';

type Props = {
	type?: string;
	filter?: string;
} & Omit<PropsOf<typeof TagList>, 'filter'>;

const TagNamePrefixFilteredList = ({
	type = undefined,
	filter: prefix = undefined,
	...rest
}: Props) => {
	if (type !== undefined && type !== 'prefix') return <NoMatch />;

	const filter = prefix
		? {name: {$regex: `^${escapeStringRegexp(prefix)}`, $options: 'i'}}
		: {};

	const list = <TagList filter={filter} {...rest} />;

	return (
		<div>
			<AlphabetJumper
				current={prefix}
				toURL={(x) =>
					`${prefix ? '../' : ''}query/prefix/${myEncodeURIComponent(x)}`
				}
			/>
			<Routes>
				<Route index element={list} />
				<Route path="page/:page" element={list} />
			</Routes>
		</div>
	);
};

export default TagNamePrefixFilteredList;
