import React, {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import PropTypes, {InferProps} from 'prop-types';

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
			minHeight: 200,
		},
		details: {
			display: 'flex',
			flex: 1,
			flexDirection: 'column',
			minWidth: 300,
		},
		header: {
			flex: 1,
			'& > div': {
				minWidth: 0,
				'& > span': {
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				},
			},
		},
		content: {
			flex: '1 0 auto',
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
			flex: 'none',
		},
		actions: {
			display: 'flex',
			paddingLeft: theme.spacing(2),
		},
		name: {
			display: 'flex',
		},
	});

const useStyles = makeStyles(styles);

export const StaticTagCardPropTypes = {
	tag: PropTypes.any.isRequired,
	url: PropTypes.func.isRequired,
	avatar: PropTypes.object.isRequired,

	subheader: PropTypes.string.isRequired,
	content: PropTypes.element,
	actions: PropTypes.element,

	RenamingDialog: PropTypes.elementType,
	DeletionDialog: PropTypes.elementType,
	abbr: PropTypes.string,
};

export type StaticTagCardProps = InferProps<typeof StaticTagCardPropTypes>;

const StaticTagCard = React.forwardRef<any, StaticTagCardProps>(
	(props, ref) => {
		const {
			tag,
			avatar,
			subheader,
			url,
			content,
			actions = null,
			RenamingDialog,
			DeletionDialog,
			abbr,
		} = props;

		const classes = useStyles();
		const history = useHistory();

		const [deleting, setDeleting] = useState(false);
		const [renaming, setRenaming] = useState(false);

		const openRenamingDialog = () => {
			setRenaming(true);
		};

		const closeRenamingDialog = () => {
			setRenaming(false);
		};

		const openDeletionDialog = () => {
			setDeleting(true);
		};

		const closeDeletionDialog = () => {
			setDeleting(false);
		};

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
			<Card ref={ref} className={classes.card}>
				<div className={classes.details}>
					<CardHeader
						className={classes.header}
						avatar={avatar}
						title={tag.name}
						subheader={subheader}
						component={Link}
						to={url(tag.name)}
					/>
					<CardContent className={classes.content}>{content}</CardContent>
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
						{actions}
					</CardActions>
				</div>
				<div className={classes.photoPlaceHolder}>{abbr || tag.name[0]}</div>
			</Card>
		);
	},
);

StaticTagCard.propTypes = StaticTagCardPropTypes;

export default StaticTagCard;
