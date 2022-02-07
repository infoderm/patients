import React, {useReducer} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import format from 'date-fns/format';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import PhotoIcon from '@material-ui/icons/Photo';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import AttachmentIcon from '@material-ui/icons/Attachment';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

import {FileObj} from 'meteor/ostrio:files';
import {link} from '../../api/attachments';
import patientsDetach from '../../api/endpoint/patients/detach';
import consultationsDetach from '../../api/endpoint/consultations/detach';

import useUniqueId from '../hooks/useUniqueId';
import {MetadataType} from '../../api/uploads';
import AttachmentThumbnail from './AttachmentThumbnail';
import AttachmentEditionDialog from './AttachmentEditionDialog';
import AttachmentLinkingDialog from './AttachmentLinkingDialog';
import AttachmentDeletionDialog from './AttachmentDeletionDialog';
import AttachmentSuperDeletionDialog from './AttachmentSuperDeletionDialog';

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'block',
		margin: theme.spacing(1),
	},
	headerContent: {
		overflow: 'hidden',
	},
	headerContentTitle: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	headerContentSubheader: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	thumbnail: {
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

interface Props {
	attachment: FileObj<MetadataType>;
	info?: {
		parentCollection: string;
		parentId: string;
	};
}

const AttachmentCard = ({attachment, info}: Props) => {
	const classes = useStyles();
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

	return (
		<Card className={classes.card}>
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
							aria-owns={menu ? menuId : null}
							aria-haspopup="true"
							onClick={(event) => {
								dispatch({type: 'openMenu', event});
							}}
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id={menuId}
							anchorEl={menu}
							open={Boolean(menu)}
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
				height={600}
				attachmentId={attachment._id}
				{...anchorProps}
			/>
		</Card>
	);
};

export default AttachmentCard;
