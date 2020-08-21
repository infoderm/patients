import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

const ListWithHeader = (props) => {
	const {
		name,
		Card,
		List,
		useItem,
		listProps,
		root,
		page,
		perpage,
		items
	} = props;

	const {loading, item} = useItem(name);

	if (loading) return <Loading />;

	if (!item) return <NoContent>No item named {name}</NoContent>;

	return (
		<div>
			{Card && (
				<div>
					<div style={{paddingBottom: 50, paddingTop: 20}}>
						<Grid container spacing={3}>
							<Grid item sm={12} md={12} lg={3} xl={4} />
							<Card loading={loading} item={item} />
						</Grid>
					</div>
					<Typography variant="h2">Patients</Typography>
				</div>
			)}
			<List
				{...listProps}
				root={root}
				page={page}
				perpage={perpage}
				items={items}
			/>
		</div>
	);
};

const TagDetails = (props) => {
	const {Card, List, useItem, listProps, root, page, perpage, items} = props;

	if (!Card)
		return (
			<List
				{...listProps}
				root={root}
				page={page}
				perpage={perpage}
				items={items}
			/>
		);

	if (!useItem) throw new Error('useItem must be given if Card is given');

	return <ListWithHeader {...props} />;
};

TagDetails.propTypes = {
	List: PropTypes.elementType.isRequired,
	Card: PropTypes.elementType,
	useItem: PropTypes.func,
	root: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,

	subscription: PropTypes.string.isRequired,
	collection: PropTypes.object.isRequired,
	selector: PropTypes.object.isRequired,
	sort: PropTypes.object.isRequired,
	fields: PropTypes.object,

	items: PropTypes.array.isRequired
};

export default withTracker(
	({subscription, name, collection, selector, sort, fields, page, perpage}) => {
		Meteor.subscribe(subscription, name, {sort, fields});
		return {
			items: collection
				.find(selector, {
					sort,
					fields,
					skip: (page - 1) * perpage,
					limit: perpage
				})
				.fetch()
		};
	}
)(TagDetails);
