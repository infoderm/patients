import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import React from 'react' ;
import PropTypes from 'prop-types';

import { myEncodeURIComponent } from '../../client/uri.js';

function TagDetails ( { Card , List , listProps , root , name , page , perpage , items } ) {
	return (
		<div>
			{ Card && <div>
				<div style={{ paddingBottom: 50 , paddingTop: 20 }}>
					<Grid container spacing={3}>
						<Grid item sm={12} md={12} lg={3} xl={4}></Grid>
						<Card name={name}/>
					</Grid>
				</div>
				<Typography variant="h2">Patients</Typography>
			</div>}
			<List {...listProps} root={`${root}/${myEncodeURIComponent(name)}`} page={page} perpage={perpage} items={items}/>
		</div>
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
		items: collection.find(selector, {sort, skip: (page-1)*perpage, limit: perpage}).fetch()
	} ;
}) ( TagDetails );
