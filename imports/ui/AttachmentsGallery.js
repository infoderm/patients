import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import { Mongo } from 'meteor/mongo';

import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import startOfDay from 'date-fns/start_of_day' ;

import { list , map , groupby } from '@aureooms/js-itertools' ;

import { Uploads } from '../api/uploads.js';

import AttachmentCard from './AttachmentCard.js';

const styles = theme => ({
});

class AttachmentGallery extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const { classes, loading, attachmentsParents, attachments } = this.props ;

		if ( loading ) return 'Loading...';

		const attachmentsList = [];

		attachments.map( x => attachmentsList.push(x) ) ;

		const groups = list(
			map( ( [ k , g ] ) => [ k , list( g ) ] ,
			groupby( x => x.meta.createdAt && startOfDay(x.meta.createdAt) , attachmentsList ) )
		) ;

		return (
			<div>
				{list(map( ( [ k , g ] ) => g.map(
				attachment => <AttachmentCard key={attachment._id} attachment={attachment} parent={attachmentsParents.get(attachment._id)}/>
				) , groups ))}
			</div>
		);
	}

}

AttachmentGallery.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(({attachmentsInfo}) => {
	const handle = Meteor.subscribe('uploads');
	if (!handle.ready()) return { loading: true };

	const attachmentsId = attachmentsInfo.map(x => x[0]);
	return {
		attachmentsParents: new Map(attachmentsInfo),
		attachments: Uploads.find({_id: {$in: attachmentsId}}, {sort: { 'meta.createdAt': -1}}).fetch(),
	} ;

}) ( withStyles(styles, { withTheme: true })(AttachmentGallery) );
