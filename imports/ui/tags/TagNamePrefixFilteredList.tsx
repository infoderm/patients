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
} & Omit<PropsOf<typeof TagList>, 'query'>;

const TagNamePrefixFilteredList = ({
	type = undefined,
	filter = undefined,
	...rest
}: Props) => {
	if (type !== undefined && type !== 'prefix') return <NoMatch />;

	const query = filter
		? {name: {$regex: `^${escapeStringRegexp(filter)}`, $options: 'i'}}
		: {};

	const list = <TagList query={query} {...rest} />;

	return (
		<div>
			<AlphabetJumper
				current={filter}
				toURL={(x) =>
					`${filter ? '../' : ''}query/prefix/${myEncodeURIComponent(x)}`
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
