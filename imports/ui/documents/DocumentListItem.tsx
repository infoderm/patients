import React from 'react';

import {Link} from 'react-router-dom';

import classNames from 'classnames';
import {makeStyles} from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import PropsOf from '../../util/PropsOf';

import DocumentChips from './DocumentChips';

import DocumentDownloadIconButton from './actions/DocumentDownloadIconButton';
import DocumentDeletionIconButton from './actions/DocumentDeletionIconButton';

const useStyles = makeStyles((theme) => ({
	item: {
		opacity: 1,
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		paddingRight: theme.spacing(6 * 3),
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	loading: {
		opacity: 0.7,
	},
}));

interface Props extends PropsOf<typeof DocumentChips> {
	loading?: boolean;
}

const DocumentListItem = ({loading = false, document, ...rest}: Props) => {
	const classes = useStyles();

	const {_id} = document;

	return (
		<ListItem
			component={Paper}
			className={classNames(classes.item, {
				[classes.loading]: loading,
			})}
			variant="outlined"
		>
			<ListItemText
				primary={
					<div className={classes.chips}>
						<DocumentChips document={document} {...rest} />
					</div>
				}
			/>
			<ListItemSecondaryAction>
				<DocumentDeletionIconButton document={document} />
				<DocumentDownloadIconButton document={document} />
				<IconButton
					component={Link}
					rel="noreferrer"
					target="_blank"
					to={`/document/${_id}`}
					aria-label="Open in New Tab"
				>
					<OpenInNewIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

DocumentListItem.projection = {
	...DocumentChips.projection,
};

export default DocumentListItem;
