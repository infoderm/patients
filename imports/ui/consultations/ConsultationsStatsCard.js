import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import dateFormat from 'date-fns/format';

import {makeStyles} from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import {consultations} from '../../api/consultations.js';

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		minHeight: 200
	},
	details: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minWidth: 300
	},
	header: {
		flex: 1,
		'& > div': {
			minWidth: 0,
			'& > span': {
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			}
		}
	},
	content: {
		flex: '1 0 auto'
	},
	photoPlaceHolder: {
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999',
		flex: 'none'
	},
	actions: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
	name: {
		display: 'flex'
	},
	avatar: {
		color: '#111',
		backgroundColor: 'yellow'
	},
	paragraph: {
		lineHeight: 1.35
	}
}));

const subheader = ({count}) =>
	count === undefined ? '...' : `${count} consultations`;

const ConsultationsStatsCard = (props) => {
	const classes = useStyles();

	const {title, avatar, url, actions, stats, abbr} = props;

	const content = ({count, total, first, last}) => {
		if (count === undefined)
			return (
				<Typography className={classes.paragraph} variant="body1">
					Total ... <br />
					From ...
				</Typography>
			);
		if (count === 0) {
			return null;
		}

		const fmt = 'MMM do, yyyy';
		return (
			<Typography className={classes.content} variant="body1">
				Total {total} € <br />
				From {dateFormat(first, fmt)} to {dateFormat(last, fmt)}.
			</Typography>
		);
	};

	return (
		<Card className={classes.card}>
			<div className={classes.details}>
				<CardHeader
					className={classes.header}
					avatar={<Avatar className={classes.avatar}>{avatar}</Avatar>}
					title={title}
					subheader={subheader(stats)}
					component={Link}
					to={url}
				/>
				<CardContent className={classes.content}>{content(stats)}</CardContent>
				<CardActions disableSpacing className={classes.actions}>
					{actions(stats)}
				</CardActions>
			</div>
			<div className={classes.photoPlaceHolder}>{abbr || title.slice(-2)}</div>
		</Card>
	);
};

ConsultationsStatsCard.defaultProps = {
	url: undefined,
	actions: () => null,
	stats: {}
};

ConsultationsStatsCard.propTypes = {
	title: PropTypes.string.isRequired,
	url: PropTypes.string,
	avatar: PropTypes.string.isRequired,
	actions: PropTypes.func,

	stats: PropTypes.object
};

const ReactiveConsultationsStatsCard = withTracker(({query}) => {
	const {key, publication, Collection} = consultations.stats;

	console.debug({publication, query});

	const handle = Meteor.subscribe(publication, query);
	const result = {
		stats: undefined
	};

	if (handle.ready()) {
		result.stats = Collection.findOne(key(query));
	}

	return result;
})(ConsultationsStatsCard);

ReactiveConsultationsStatsCard.propTypes = {
	query: PropTypes.object.isRequired
};

export default ReactiveConsultationsStatsCard;
