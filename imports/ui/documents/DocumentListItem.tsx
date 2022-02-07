import React from 'react';

import {Link} from 'react-router-dom';

import classNames from 'classnames';
import makeStyles from '@mui/styles/makeStyles';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
