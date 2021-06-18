import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import dateFormat from 'date-fns/format';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';
import {groupby} from '@iterable-iterator/group';

import Loading from '../navigation/Loading';

import {Attachments} from '../../api/attachments';
import AttachmentsGrid from './AttachmentsGrid';

const useStyles = makeStyles((theme) => ({
	group: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2)
	}
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
						<Grid key={k} item container spacing={2} className={classes.group}>
							<Grid item lg={12}>
								<Typography variant="h3">
									{k === Number.POSITIVE_INFINITY
										? 'Pièces jointes au patient'
										: `Consultation du ${dateFormat(
												new Date(k),
												'yyyy-MM-dd'
										  )}`}
								</Typography>
							</Grid>
							<AttachmentsGrid
								item
								spacing={2}
								attachments={g}
								attachmentsInfo={attachmentsInfo}
							/>
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
	const handle = Meteor.subscribe('attachments', query, options);

	if (!handle.ready()) {
		return {loading: true};
	}

	return {
		loading: false,
		attachmentsInfo: new Map(attachmentsInfo.map((x) => [x.attachmentId, x])),
		attachments: Attachments.find(query, options).fetch()
	};
})(AttachmentsGallery);
