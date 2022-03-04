import React, {useReducer} from 'react';

import {styled} from '@mui/material/styles';

import format from 'date-fns/format';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoIcon from '@mui/icons-material/Photo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AttachmentIcon from '@mui/icons-material/Attachment';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import {AttachmentDocument} from '../../api/collection/attachments';

import {link} from '../../api/attachments';
import patientsDetach from '../../api/endpoint/patients/detach';
import consultationsDetach from '../../api/endpoint/consultations/detach';

import useUniqueId from '../hooks/useUniqueId';
import AttachmentThumbnail from './AttachmentThumbnail';
import AttachmentEditionDialog from './AttachmentEditionDialog';
import AttachmentLinkingDialog from './AttachmentLinkingDialog';
import AttachmentDeletionDialog from './AttachmentDeletionDialog';
import AttachmentSuperDeletionDialog from './AttachmentSuperDeletionDialog';

const PREFIX = 'AttachmentCard';

const classes = {
	card: `${PREFIX}-card`,
	headerContent: `${PREFIX}-headerContent`,
	headerContentTitle: `${PREFIX}-headerContentTitle`,
	headerContentSubheader: `${PREFIX}-headerContentSubheader`,
	thumbnail: `${PREFIX}-thumbnail`,
};

const StyledCard = styled(Card)(({theme}) => ({
	[`&.${classes.card}`]: {
		display: 'block',
		margin: theme.spacing(1),
	},

	[`& .${classes.headerContent}`]: {
		overflow: 'hidden',
	},

	[`& .${classes.headerContentTitle}`]: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},

	[`& .${classes.headerContentSubheader}`]: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},

	[`& .${classes.thumbnail}`]: {
		height: 300,
	},
}));

const initialState = {
	menu: null,
	editing: false,
	linking: false,
	deleting: false,
	superDeleting: false,
};

/**
 * reducer.
 *
 * @param {object} state
 * @param {{type: string, event?: any}} action
 */
const reducer = (state, action) => {
	switch (action.type) {
		case 'openMenu':
			return {...state, menu: action.event.currentTarget};
		case 'closeMenu':
			return {...state, menu: null};
		case 'openEditionDialog':
			return {...state, menu: null, editing: true};
		case 'openLinkingDialog':
			return {...state, menu: null, linking: true};
		case 'openDeletionDialog':
			return {...state, menu: null, deleting: true};
		case 'openSuperDeletionDialog':
			return {...state, menu: null, superDeleting: true};
		case 'closeEditionDialog':
			return {...state, editing: false};
		case 'closeLinkingDialog':
			return {...state, linking: false};
		case 'closeDeletionDialog':
			return {...state, deleting: false};
		case 'closeSuperDeletionDialog':
			return {...state, superDeleting: false};
		default:
			throw new Error(`Unknown action type ${action.type}.`);
	}
};

export interface AttachmentInfo {
	parentCollection: string;
	parentId: string;
}

interface Props {
	attachment: AttachmentDocument;
	info?: AttachmentInfo;
}

const AttachmentCard = ({attachment, info}: Props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const {menu, editing, linking, deleting, superDeleting} = state;

	const headerClasses = {
		content: classes.headerContent,
		title: classes.headerContentTitle,
		subheader: classes.headerContentSubheader,
	};

	const detached =
		!attachment?.meta?.attachedToPatients?.length &&
		!attachment?.meta?.attachedToConsultations?.length;

	const anchorProps = {
		component: 'a',
		href: link(attachment),
		rel: 'noreferrer',
		target: '_blank',
	};

	const subheader = [
		attachment.meta.createdAt &&
			`A ${format(attachment.meta.createdAt, 'yyyy-MM-dd')}`,
		attachment.meta.lastModified &&
			`M ${format(attachment.meta.lastModified, 'yyyy-MM-dd')}`,
	]
		.filter((x) => Boolean(x))
		.join('/');

	const detach =
		info?.parentCollection === 'patients'
			? patientsDetach
			: info?.parentCollection === 'consultations'
			? consultationsDetach
			: undefined;

	const menuId = useUniqueId('attachment-card-more-menu');
	const open = Boolean(menu);

	return (
		<StyledCard className={classes.card}>
			<CardHeader
				classes={headerClasses}
				avatar={
					<Avatar>
						{attachment.isImage ? (
							<PhotoIcon />
						) : attachment.isPDF ? (
							<PictureAsPdfIcon />
						) : (
							<AttachmentIcon />
						)}
					</Avatar>
				}
				title={attachment.name}
				subheader={subheader}
				action={
					<>
						<IconButton
							size="large"
							aria-controls={open ? menuId : null}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={(event) => {
								dispatch({type: 'openMenu', event});
							}}
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id={menuId}
							anchorEl={menu}
							open={open}
							onClose={() => {
								dispatch({type: 'closeMenu'});
							}}
						>
							<MenuItem
								onClick={() => {
									dispatch({type: 'openEditionDialog'});
								}}
							>
								<ListItemIcon>
									<EditIcon />
								</ListItemIcon>
								<ListItemText>Rename</ListItemText>
							</MenuItem>
							{detached && (
								<MenuItem
									onClick={() => {
										dispatch({type: 'openLinkingDialog'});
									}}
								>
									<ListItemIcon>
										<LinkIcon />
									</ListItemIcon>
									<ListItemText>Attach</ListItemText>
								</MenuItem>
							)}
							{info && (
								<MenuItem
									onClick={() => {
										dispatch({type: 'openDeletionDialog'});
									}}
								>
									<ListItemIcon>
										<LinkOffIcon />
									</ListItemIcon>
									<ListItemText>Detach</ListItemText>
								</MenuItem>
							)}
							{detached && (
								<MenuItem
									onClick={() => {
										dispatch({type: 'openSuperDeletionDialog'});
									}}
								>
									<ListItemIcon>
										<DeleteForeverIcon />
									</ListItemIcon>
									<ListItemText>Delete forever</ListItemText>
								</MenuItem>
							)}
						</Menu>
						<AttachmentEditionDialog
							open={editing}
							attachment={attachment}
							onClose={() => {
								dispatch({type: 'closeEditionDialog'});
							}}
						/>
						{detached && (
							<AttachmentLinkingDialog
								open={linking}
								attachment={attachment}
								onClose={() => {
									dispatch({type: 'closeLinkingDialog'});
								}}
							/>
						)}
						{info && (
							<AttachmentDeletionDialog
								open={deleting}
								itemId={info.parentId}
								attachment={attachment}
								endpoint={detach}
								onClose={() => {
									dispatch({type: 'closeDeletionDialog'});
								}}
							/>
						)}
						{detached && (
							<AttachmentSuperDeletionDialog
								open={superDeleting}
								attachment={attachment}
								onClose={() => {
									dispatch({type: 'closeSuperDeletionDialog'});
								}}
							/>
						)}
					</>
				}
			/>
			<AttachmentThumbnail
				className={classes.thumbnail}
				width={450}
				height={300}
				attachmentId={attachment._id}
				{...anchorProps}
			/>
		</StyledCard>
	);
};

export default AttachmentCard;
