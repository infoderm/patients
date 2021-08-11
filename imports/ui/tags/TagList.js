import React from 'react';

import PropTypes from 'prop-types';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import TagGrid from './TagGrid';

const TagList = (props) => {
	const {useTags, query, sort, page, perpage, Card, root, url} = props;

	const deps = [JSON.stringify({query, sort, page, perpage})];
	const options = {sort, skip: (page - 1) * perpage, limit: perpage};
	const {loading, results: tags} = useTags(query, options, deps);

	if (loading && tags.length === 0) return <Loading />;

	const _root = root || url.split('/page/')[0];

	const style = {
		transition: 'opacity 200ms ease-out',
	};
	if (loading) style.opacity = 0.4;

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
		</>
	);
};

TagList.defaultProps = {
	page: 1,
	perpage: 10,
	query: {},
	sort: {name: 1},
};

TagList.propTypes = {
	Card: PropTypes.elementType.isRequired,
	root: PropTypes.string,
	url: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number,

	query: PropTypes.object,
	sort: PropTypes.object,

	useTags: PropTypes.func.isRequired,
};

export default TagList;
