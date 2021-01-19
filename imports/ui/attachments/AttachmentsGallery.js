import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import dateFormat from 'date-fns/format';

import {list, map, groupby} from '@aureooms/js-itertools';

import AttachmentCard from './AttachmentCard.js';

import Loading from '../navigation/Loading.js';

import {Uploads} from '../../api/uploads.js';

const useStyles = makeStyles((theme) => ({
	group: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2)
	},
	groupHeading: {
		padding: theme.spacing(2)
	},
	item: {},
	card: {}
}));

const AttachmentsGallery = (props) => {
	const {loading, attachmentsInfo, attachments} = props;

	const classes = useStyles();

	if (loading) {
		return <Loading />;
	}

	const grp = (x) => attachmentsInfo.get(x._id).group;

	const groups = list(
		map(
			([k, g]) => [k, list(g)],
			groupby(
				grp,
				attachments.sort((a, b) => grp(b) - grp(a)) // We are abusing stable native sorting here.
			)
		)
	);

	console.debug({
		attachments: attachments.map((attachment) => ({
			attachment,
			info: attachmentsInfo.get(attachment._id)
		}))
	});

	return (
		<Grid container>
			{list(
				map(
					([k, g]) => (
						<Grid key={k} item container className={classes.group}>
							<Grid item className={classes.groupHeading} lg={12}>
								<Typography variant="h3">
									{k === Infinity
										? 'Attached to Patient'
										: `Consultation du ${dateFormat(
												new Date(k),
												'yyyy-MM-dd'
										  )}`}
								</Typography>
							</Grid>
							{g.map((attachment) => (
								<Grid
									key={attachment._id}
									item
									className={classes.item}
									sm={12}
									md={4}
									xl={3}
								>
									<AttachmentCard
										className={classes.card}
										attachment={attachment}
										info={attachmentsInfo.get(attachment._id)}
									/>
								</Grid>
							))}
						</Grid>
					),
					groups
				)
			)}
		</Grid>
	);
};

AttachmentsGallery.propTypes = {
	loading: PropTypes.bool.isRequired
};

export default withTracker(({attachmentsInfo}) => {
	if (attachmentsInfo.length === 0) return {loading: false, attachments: []};

	const attachmentsId = attachmentsInfo.map((x) => x.attachmentId);
	const query = {_id: {$in: attachmentsId}};
	const options = {sort: {'meta.createdAt': -1}};
	// const options = undefined;
	const handle = Meteor.subscribe('uploads', query);

	if (!handle.ready()) {
		return {loading: true};
	}

	return {
		loading: false,
		attachmentsInfo: new Map(attachmentsInfo.map((x) => [x.attachmentId, x])),
		attachments: Uploads.find(query, options).fetch()
	};
})(AttachmentsGallery);
