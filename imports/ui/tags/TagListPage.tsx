import React from 'react';

import type GenericQueryHook from '../../api/GenericQueryHook';
import {type Sort} from '../../api/query/sort';
import type UserFilter from '../../api/query/UserFilter';
import {type TagNameFields, type TagMetadata} from '../../api/tags/TagDocument';

import useRandom from '../hooks/useRandom';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';

import TagGrid from './TagGrid';

export type TagListPageProps<T extends TagNameFields & TagMetadata> = {
	readonly Card: React.ElementType;
	readonly page?: number;
	readonly perpage?: number;

	readonly filter?: UserFilter<T>;
	readonly sort?: Sort<T>;

	readonly useTags: GenericQueryHook<T>;

	readonly LoadingIndicator?: React.ElementType<{}>;
	readonly EmptyPage?: React.ElementType<{page: number}>;
};

const DefaultLoadingIndicator = Loading;
const DefaultEmptyPage = ({page}: {readonly page: number}) => (
	<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
);

const TagListPage = <T extends TagNameFields & TagMetadata>({
	useTags,
	filter = {},
	sort = {name: 1} as Sort<T>,
	page = 1,
	perpage = 10,
	Card,
	LoadingIndicator = DefaultLoadingIndicator,
	EmptyPage = DefaultEmptyPage,
}: TagListPageProps<T>) => {
	const [key, refresh] = useRandom();
	const query = {
		filter,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};
	const deps = [JSON.stringify(query), page, perpage, key];
	const {loading, dirty, results: tags} = useTags(query, deps);

	const style = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : undefined,
	};

	return (
		<>
			<div style={style}>
				{tags.length === 0 ? (
					loading ? (
						<LoadingIndicator />
					) : (
						<EmptyPage page={page} />
					)
				) : (
					<TagGrid Card={Card} tags={tags} />
				)}
			</div>
			<Paginator loading={loading} end={tags.length < perpage} />
			{dirty && <Refresh onClick={refresh} />}
		</>
	);
};

export default TagListPage;
