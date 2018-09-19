import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

function TagDetails ( { List , root , name , page , perpage , items } ) {
	return (
		<List root={`${root}/${name}`} page={page} perpage={perpage} items={items}/>
	) ;
}

TagDetails.propTypes = {

	List: PropTypes.func.isRequired,
	root: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,

	subscription: PropTypes.string.isRequired,
	collection: PropTypes.object.isRequired,
	selector: PropTypes.object.isRequired,
	sort: PropTypes.object.isRequired,

	items: PropTypes.array.isRequired,

} ;

export default withTracker(({subscription, name, collection, selector, sort, page, perpage}) => {
	Meteor.subscribe(subscription, name);
	return {
		items: collection.find(selector, {sort, skip: page*perpage, limit: perpage}).fetch()
	} ;
}) ( TagDetails );
