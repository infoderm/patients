import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';
import {withRouter, Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import useIsMounted from '../hooks/useIsMounted';

const styles = (theme) =>
	createStyles({
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
		}
	});

const useStyles = makeStyles(styles);

const TagCard = (props) => {
	const {
		history,
		tag,
		avatar,
		subheader,
		url,
		content,
		actions,
		stats,
		items,
		RenamingDialog,
		DeletionDialog,
		abbr
	} = props;

	const classes = useStyles();

	const [deleting, setDeleting] = useState(false);
	const [renaming, setRenaming] = useState(false);

	const openRenamingDialog = () => setRenaming(true);
	const closeRenamingDialog = () => setRenaming(false);
	const openDeletionDialog = () => setDeleting(true);
	const closeDeletionDialog = () => setDeleting(false);

	const isMounted = useIsMounted();

	const onRename = (newName) => {
		const currentURL = history.location.pathname.replaceAll(' ', '%20');
		const oldURL = url(tag.name);
		if (currentURL === oldURL) {
			const newURL = url(newName);
			history.push(newURL);
		} else if (isMounted()) {
			closeRenamingDialog();
		}
	};

	return (
		<Card className={classes.card}>
			<div className={classes.details}>
				<CardHeader
					className={classes.header}
					avatar={avatar}
					title={tag.name}
					subheader={subheader(stats, items)}
					component={Link}
					to={url(tag.name)}
				/>
				<CardContent className={classes.content}>
					{content(stats, items)}
				</CardContent>
				<CardActions disableSpacing className={classes.actions}>
					{RenamingDialog && (
						<Button color="primary" onClick={openRenamingDialog}>
							Rename
							<EditIcon />
						</Button>
					)}
					{DeletionDialog && (
						<Button color="secondary" onClick={openDeletionDialog}>
							Delete
							<DeleteIcon />
						</Button>
					)}
					{RenamingDialog && (
						<RenamingDialog
							open={renaming}
							tag={tag}
							onClose={closeRenamingDialog}
							onRename={onRename}
						/>
					)}
					{DeletionDialog && (
						<DeletionDialog
							open={deleting}
							tag={tag}
							onClose={closeDeletionDialog}
						/>
					)}
					{actions(stats, items)}
				</CardActions>
			</div>
			<div className={classes.photoPlaceHolder}>{abbr || tag.name[0]}</div>
		</Card>
	);
};

TagCard.defaultProps = {
	actions: () => null,
	stats: {},
	items: undefined
};

TagCard.propTypes = {
	history: PropTypes.object.isRequired,

	tag: PropTypes.object.isRequired,
	url: PropTypes.func.isRequired,
	avatar: PropTypes.object.isRequired,
	subheader: PropTypes.func.isRequired,
	content: PropTypes.func.isRequired,
	actions: PropTypes.func,

	stats: PropTypes.object,
	items: PropTypes.array
};

const ReactiveTagCard = withRouter(
	withTracker(
		({
			tag,
			subscription,
			statsSubscription,
			collection,
			statsCollection,
			selector,
			options,
			limit
		}) => {
			const name = tag.name;
			const handle = subscription
				? Meteor.subscribe(subscription, name, {...options, limit})
				: {ready: () => false};
			const statsHandle = Meteor.subscribe(statsSubscription, name);
			const result = {
				items: undefined,
				stats: undefined
			};

			if (handle.ready()) {
				result.items = collection.find(selector, {...options, limit}).fetch();
			}

			if (statsHandle.ready()) {
				result.stats = statsCollection.findOne({name});
			}

			return result;
		}
	)(TagCard)
);

ReactiveTagCard.defaultProps = {
	limit: 0,
	subscription: undefined,
	collection: {
		find: () => () => []
	}
};

ReactiveTagCard.propTypes = {
	subscription: PropTypes.string,
	statsSubscription: PropTypes.string.isRequired,
	collection: PropTypes.object,
	statsCollection: PropTypes.object.isRequired,
	selector: PropTypes.object.isRequired,
	options: PropTypes.object,
	limit: PropTypes.number
};

export default ReactiveTagCard;
