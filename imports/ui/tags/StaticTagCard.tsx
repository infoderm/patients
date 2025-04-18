import React, {useState} from 'react';
import {useNavigate, Link, useParams} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import MuiCardHeader from '@mui/material/CardHeader';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardActions from '@mui/material/CardActions';
import MuiCardMedia from '@mui/material/CardMedia';

import {emphasize} from '../../util/color';
import useIsMounted from '../hooks/useIsMounted';
import DeleteButton from '../button/DeleteButton';
import RenameButton from '../button/RenameButton';
import {normalizedLine} from '../../api/string';

const Card = styled(MuiCard, {
	shouldForwardProp: (prop) => prop !== 'deleted',
})<{deleted: boolean}>(({deleted}) => ({
	position: 'relative',
	overflow: 'visible',
	display: 'flex',
	minHeight: 200,
	opacity: deleted ? 0.4 : 1,
}));

const CardDetails = styled(Box)({
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	minWidth: 300,
});

const UnstyledLinkedCardHeader = ({to, ...rest}) => {
	return <MuiCardHeader component={Link} to={to} {...rest} />;
};

const LinkedCardHeader = styled(UnstyledLinkedCardHeader)(({theme}) => ({
	flex: 1,
	'& > .MuiCardHeader-content': {
		minWidth: 0,
		'& > span': {
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			'&.MuiCardHeader-title': {
				fontWeight: 'bold',
				color: theme.palette.primary.main,
				'&:hover': {
					textDecoration: 'underline',
				},
			},
		},
	},
}));

const CardContent = styled(MuiCardContent)({
	flex: '1 0 auto',
});

const CardActions = styled(MuiCardActions)(({theme}) => ({
	display: 'flex',
	paddingLeft: theme.spacing(2),
}));

const CardMedia = styled(MuiCardMedia)(({theme}) => ({
	display: 'flex',
	fontSize: '4rem',
	width: 140,
	alignItems: 'center',
	justifyContent: 'center',
	color: theme.palette.getContrastText(theme.palette.background.paper),
	backgroundColor: emphasize(theme.palette.background.paper, 0.1),
}));

const Veil = styled('div')({
	position: 'absolute',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	zIndex: 1,
	fontSize: '2rem',
});

export type StaticTagCardProps = {
	readonly loading: boolean;
	readonly found: boolean;
	readonly tag: {name: string; displayName?: string};
	readonly url: (name: string) => string;
	readonly avatar: {};

	readonly subheader: string;
	readonly content?: JSX.Element | null;
	readonly actions?: JSX.Element | null;

	readonly RenamingDialog?: React.ElementType;
	readonly DeletionDialog?: React.ElementType;
	readonly abbr?: string;
};

const StaticTagCard = React.forwardRef<any, StaticTagCardProps>(
	(
		{
			loading,
			found,
			tag,
			avatar,
			subheader,
			url,
			content,
			actions = null,
			RenamingDialog,
			DeletionDialog,
			abbr,
		},
		ref,
	) => {
		const navigate = useNavigate();
		const params = useParams<{name?: string}>();

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
			if (isMounted()) {
				closeRenamingDialog();
			}

			if (params.name !== undefined) {
				const newURL = url(normalizedLine(newName));
				navigate(newURL);
			}
		};

		const deleted = !loading && !found;
		const {name, displayName = name} = tag;

		return (
			<Card ref={ref} deleted={deleted}>
				{deleted && <Veil>DELETED</Veil>}
				<CardDetails>
					<LinkedCardHeader
						avatar={avatar}
						title={displayName}
						subheader={subheader}
						to={url(name)}
					/>
					<CardContent>{content}</CardContent>
					{!deleted && (
						<CardActions disableSpacing>
							{RenamingDialog && (
								<RenameButton
									loading={renaming}
									color="primary"
									onClick={openRenamingDialog}
								/>
							)}
							{DeletionDialog && (
								<DeleteButton loading={deleting} onClick={openDeletionDialog} />
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
					)}
				</CardDetails>
				{/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
				<CardMedia>{abbr || displayName.slice(0, 1)}</CardMedia>
			</Card>
		);
	},
);

export default StaticTagCard;
