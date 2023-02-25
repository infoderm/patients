import React from 'react';

import {styled} from '@mui/material/styles';

import {Link} from 'react-router-dom';

import MuiListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type PropsOf from '../../lib/types/PropsOf';

import DocumentChips from './DocumentChips';

import DocumentDownloadIconButton from './actions/DocumentDownloadIconButton';
import DocumentDeletionIconButton from './actions/DocumentDeletionIconButton';

const Chips = styled('div')({
	display: 'flex',
	flexWrap: 'wrap',
});

const UnstyledListItem = (props) => (
	<MuiListItem component={Paper} {...props} />
);

const ListItem = styled(UnstyledListItem, {
	shouldForwardProp: (prop) => prop !== 'loading',
})<{loading: boolean}>(({theme, loading}) => ({
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2),
	paddingRight: theme.spacing(6 * 3),
	opacity: loading ? 0.7 : 1,
}));

type Props = {
	loading?: boolean;
} & PropsOf<typeof DocumentChips>;

const DocumentListItem = ({loading = false, document, ...rest}: Props) => {
	const {_id} = document;

	return (
		<ListItem loading={loading} variant="outlined">
			<ListItemText
				primary={
					<Chips>
						<DocumentChips document={document} {...rest} />
					</Chips>
				}
			/>
			<ListItemSecondaryAction>
				<DocumentDeletionIconButton document={document} />
				<DocumentDownloadIconButton document={document} />
				<IconButton
					size="large"
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
