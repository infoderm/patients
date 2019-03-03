import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import PropTypes from 'prop-types';

import React from 'react';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

const IssueListPreview = ( { classes, loading, page, perpage, items, noIssueMessage, createItem, listPageURL, Container, ...rest }) => {

	if (loading) return <div {...rest}>Loading...</div>;

	if (items.length === 0) return <div {...rest}>{noIssueMessage}</div>;

	return (
		<Container {...rest}>
			{ items.map(createItem) }
			{ items.length === perpage &&
				<Button className={classes.button} color="default" component={Link} to={listPageURL}>
					See all similar issues
					<ArrowForwardIcon className={classes.rightIcon}/>
				</Button>
			}
		</Container>
	);

}

IssueListPreview.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	subscription: PropTypes.string.isRequired,
	collection: PropTypes.object.isRequired,
	query: PropTypes.object.isRequired,
	noIssueMessage: PropTypes.string.isRequired,
	createItem: PropTypes.func.isRequired,
	listPageURL: PropTypes.string.isRequired,
} ;

export default withTracker(({page, perpage, subscription, collection, query}) => {
	const handle = Meteor.subscribe(subscription);
	if ( !handle.ready()) return { loading: true } ;
	return {
		loading: false,
		items: collection.find(query,{
			skip: page*perpage,
			limit: perpage,
		}).fetch(),
	} ;
}) ( withStyles(styles, { withTheme: true })(IssueListPreview) );
