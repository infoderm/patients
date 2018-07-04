import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import { Mongo } from 'meteor/mongo';

import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import format from 'date-fns/format' ;
import startOfDay from 'date-fns/start_of_day' ;
import addDays from 'date-fns/add_days' ;
import subDays from 'date-fns/sub_days' ;
import addHours from 'date-fns/add_hours' ;
import isBefore from 'date-fns/is_before' ;

import { list , map , groupby } from '@aureooms/js-itertools' ;

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import { Uploads } from '../api/uploads.js';

import AttachmentThumbnail from './AttachmentThumbnail.js';

const styles = theme => ({
	card: {
		display: 'inline-block',
		margin: theme.spacing.unit,
	},
	thumbnail: {
		height: "300px",
	},
});

const link = attachment => `/${Uploads.link(attachment).split('/').slice(3).join('/')}` ;

class ConsultationsList extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const { classes, loading, attachments } = this.props ;

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
					attachment => (
					<Card className={classes.card} key={attachment._id} component="a" href={link(attachment)}>
						<CardHeader
							title={attachment.name}
							subheader={format(k, 'YYYY-MM-DD')}
						/>
						<AttachmentThumbnail className={classes.thumbnail} height="300" attachmentId={attachment._id}/>
					</Card>
					)
				) , groups ))}
			</div>
		);
	}

}

ConsultationsList.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(({attachmentsId}) => {
	const handle = Meteor.subscribe('uploads');
	if (!handle.ready()) return { loading: true };

	return {
		attachments: Uploads.find({_id: {$in: attachmentsId}}, {sort: { 'meta.createdAt': -1}}).fetch()
	} ;

}) ( withStyles(styles, { withTheme: true })(ConsultationsList) );
