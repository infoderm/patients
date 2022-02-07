import React from 'react';
import {Route, Routes} from 'react-router-dom';

import PropsOf from '../../util/PropsOf';

import {myEncodeURIComponent} from '../../util/uri';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import NoMatch from '../navigation/NoMatch';
import TagList from './TagList';

interface Props extends Omit<PropsOf<typeof TagList>, 'query'> {
	type?: string;
	filter?: string;
}

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
