import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme) => ({
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

class TagCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deleting: false,
			renaming: false
		};
	}

	openRenamingDialog = () => this.setState({renaming: true});
	closeRenamingDialog = () => this.setState({renaming: false});
	openDeletionDialog = () => this.setState({deleting: true});
	closeDeletionDialog = () => this.setState({deleting: false});

	onRename = (newName) => {
		const {url, tag, history} = this.props;
		const currentURL = history.location.pathname;
		const oldURL = url(tag.name);
		if (currentURL.startsWith(oldURL)) {
			const newURL = url(newName);
			history.push(newURL);
		} else {
			return this.closeRenamingDialog();
		}
	};

	render() {
		const {
			classes,
			tag,
			avatar,
			subheader,
			url,
			content,
			loading,
			count,
			items,
			RenamingDialog,
			DeletionDialog,
			abbr
		} = this.props;

		const {deleting, renaming} = this.state;

		return (
			<Grid item sm={12} md={12} lg={6} xl={4}>
				<Card className={classes.card}>
					<div className={classes.details}>
						<CardHeader
							className={classes.header}
							avatar={avatar}
							title={tag.name}
							subheader={loading ? '...' : subheader(count, items)}
							component={Link}
							to={url(tag.name)}
						/>
						<CardContent className={classes.content}>
							{loading ? '...' : content(count, items)}
						</CardContent>
						<CardActions disableSpacing className={classes.actions}>
							{RenamingDialog && (
								<Button color="primary" onClick={this.openRenamingDialog}>
									Rename
									<EditIcon />
								</Button>
							)}
							{DeletionDialog && (
								<Button color="secondary" onClick={this.openDeletionDialog}>
									Delete
									<DeleteIcon />
								</Button>
							)}
							{RenamingDialog && (
								<RenamingDialog
									open={renaming}
									tag={tag}
									onClose={this.closeRenamingDialog}
									onRename={this.onRename}
								/>
							)}
							{DeletionDialog && (
								<DeletionDialog
									open={deleting}
									tag={tag}
									onClose={this.closeDeletionDialog}
								/>
							)}
						</CardActions>
					</div>
					<div className={classes.photoPlaceHolder}>{abbr || tag.name[0]}</div>
				</Card>
			</Grid>
		);
	}
}

TagCard.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,

	tag: PropTypes.object.isRequired,
	url: PropTypes.func.isRequired,
	avatar: PropTypes.object.isRequired,
	subheader: PropTypes.func.isRequired,
	content: PropTypes.func.isRequired,

	// subscription: PropTypes.string.isRequired,
	// collection: PropTypes.object.isRequired,
	// selector: PropTypes.object.isRequired,
	// options: PropTypes.object,
	// limit: PropTypes.number.isRequired,

	loading: PropTypes.bool.isRequired,
	count: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired
};

export default withRouter(
	withTracker(({tag, subscription, collection, selector, options, limit}) => {
		const name = tag.name;
		const handle = Meteor.subscribe(subscription, name, options);
		if (handle.ready()) {
			const items = collection.find(selector, {...options, limit}).fetch();
			const count = collection.find(selector, options).count();
			return {loading: false, items, count};
		}

		return {loading: true, items: [], count: 0};
	})(withStyles(styles, {withTheme: true})(TagCard))
);
