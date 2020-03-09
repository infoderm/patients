import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import { Mongo } from 'meteor/mongo';

import React from 'react' ;
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import startOfDay from 'date-fns/startOfDay' ;

import { list , map , groupby } from '@aureooms/js-itertools' ;

import AttachmentCard from './AttachmentCard.js';

import Loading from '../navigation/Loading.js';

import { Uploads } from '../../api/uploads.js';

const useStyles = makeStyles(
	theme => ({
		item: {
		} ,
		card: {
		} ,
	})
);

function AttachmentsGallery ( props ) {

	const { loading, attachmentsParents, attachments } = props ;

	const classes = useStyles();

	if ( loading ) return <Loading/>;

	const attachmentsList = [];

	attachments.map( x => attachmentsList.push(x) ) ;

	const groups = list(
		map( ( [ k , g ] ) => [ k , list( g ) ] ,
		groupby( x => x.meta.createdAt && startOfDay(x.meta.createdAt) , attachmentsList ) )
	) ;

	return (
		<Grid container>
			{list(map( ( [ k , g ] ) => g.map(
				attachment => (
					<Grid key={attachment._id} className={classes.item} item sm={12} md={4} xl={3}>
						<AttachmentCard
							className={classes.card}
							attachment={attachment}
							parent={attachmentsParents.get(attachment._id)}
						/>
					</Grid>
				)
			) , groups ))}
		</Grid>
	);
}

AttachmentsGallery.propTypes = {
	loading: PropTypes.bool.isRequired,
};

export default withTracker(({attachmentsInfo}) => {
	const handle = Meteor.subscribe('uploads');
	if (!handle.ready()) return { loading: true };

	const attachmentsId = attachmentsInfo.map(x => x[0]);
	return {
		loading: false,
		attachmentsParents: new Map(attachmentsInfo),
		attachments: Uploads.find({_id: {$in: attachmentsId}}, {sort: { 'meta.createdAt': -1}}).fetch(),
	} ;

}) ( AttachmentsGallery );
