import React from 'react';

import {Mongo} from 'meteor/mongo';

import GenericQueryHook from '../../api/GenericQueryHook';
import {TagNameFields, TagMetadata} from '../../api/tags/TagDocument';

import useRandom from '../hooks/useRandom';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';

import TagGrid from './TagGrid';

export interface TagListPageProps<T> {
	Card: React.ElementType;
	page?: number;
	perpage?: number;

	query?: Mongo.Selector<T>;
	sort?: {};

	useTags?: GenericQueryHook<T>;
}

const TagListPage = <T extends TagNameFields & TagMetadata>({
	useTags,
	query = {},
	sort = {name: 1},
	page = 1,
	perpage = 10,
	Card,
}: TagListPageProps<T>) => {
	const [key, refresh] = useRandom();
	const deps = [
		JSON.stringify(query),
		JSON.stringify(sort),
		page,
		perpage,
		key,
	];
	const options: Mongo.Options<T> = {
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};
	const {loading, dirty, results: tags} = useTags(query, options, deps);

	const style = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : undefined,
	};

	return (
		<>
			<div style={style}>
				{tags.length === 0 ? (
					loading ? (
						<Loading />
					) : (
						<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
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
