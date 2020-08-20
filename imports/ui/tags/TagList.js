import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js';

const TagList = (props) => {
	const {
		subscription,
		collection,
		query,
		sort,
		page,
		perpage,
		Card,
		root,
		url
	} = props;

	const {loading, tags} = useTracker(() => {
		const handle = Meteor.subscribe(subscription, query);
		return {
			loading: !handle.ready(),
			tags: collection
				.find(query, {sort, skip: (page - 1) * perpage, limit: perpage})
				.fetch()
		};
	}, [subscription, collection, query, sort, page, perpage]);

	const _root = root || url.split('/page/')[0];

	return (
		<>
			<div>
				{loading ? (
					<Loading />
				) : tags.length > 0 ? (
					<Grid container spacing={3}>
						{tags.map((tag) => (
							<Card key={tag._id} item={tag} />
						))}
					</Grid>
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
	sort: {name: 1}
};

TagList.propTypes = {
	Card: PropTypes.elementType.isRequired,
	root: PropTypes.string,
	url: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number,

	query: PropTypes.object,
	sort: PropTypes.object,

	subscription: PropTypes.string.isRequired,
	collection: PropTypes.object.isRequired
};

export default TagList;
