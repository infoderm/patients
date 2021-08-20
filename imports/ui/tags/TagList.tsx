import React from 'react';

import PropTypes, {InferProps} from 'prop-types';

import useRandom from '../hooks/useRandom';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';

import TagGrid from './TagGrid';

const TagListPropTypes = {
	Card: PropTypes.elementType.isRequired,
	root: PropTypes.string,
	url: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number,

	query: PropTypes.object,
	sort: PropTypes.object,

	useTags: PropTypes.func.isRequired,
};

type Props = InferProps<typeof TagListPropTypes>;

const TagList = ({
	useTags,
	query = {},
	sort = {name: 1},
	page = 1,
	perpage = 10,
	Card,
	root,
	url,
}: Props) => {
	const [key, refresh] = useRandom();
	const deps = [
		JSON.stringify(query),
		JSON.stringify(sort),
		page,
		perpage,
		key,
	];
	const options = {sort, skip: (page - 1) * perpage, limit: perpage};
	const {loading, dirty, results: tags} = useTags(query, options, deps);

	if (loading && tags.length === 0) return <Loading />;

	const _root = root || url.split('/page/')[0];

	const style = {
		transition: 'opacity 200ms ease-out',
		opacity: loading ? 0.4 : undefined,
	};

	return (
		<>
			<div style={style}>
				{tags.length > 0 ? (
					<TagGrid Card={Card} tags={tags} />
				) : (
					<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
				)}
			</div>
			<Paginator page={page} end={tags.length < perpage} root={_root} />
			{dirty && <Refresh onClick={refresh} />}
		</>
	);
};

TagList.propTypes = TagListPropTypes;

export default TagList;
