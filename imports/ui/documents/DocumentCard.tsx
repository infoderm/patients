import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import MuiList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import TableChartIcon from '@mui/icons-material/TableChart';
import SubjectIcon from '@mui/icons-material/Subject';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import type PropsOf from '../../lib/types/PropsOf';

import {type DocumentDocument} from '../../api/collection/documents';

import DocumentChips from './DocumentChips';
import DocumentVersionsButton from './actions/DocumentVersionsButton';

import DocumentDeletionDialog from './DocumentDeletionDialog';
import DocumentSuperDeletionDialog from './DocumentSuperDeletionDialog';
import DocumentRestorationDialog from './DocumentRestorationDialog';
import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentUnlinkingDialog from './DocumentUnlinkingDialog';
import HealthOneLabResultsTable from './HealthOneLabResultsTable';
import ReportContents from './ReportContents';
import DocumentSource from './DocumentSource';
import DocumentDownloadButton from './actions/DocumentDownloadButton';
import DocumentDeletionButton from './actions/DocumentDeletionButton';

const Chips = styled('div')({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
});

const List = styled(MuiList)({
	width: '100%',
});

type Props = {
	readonly VersionsButton?: React.ElementType;
	readonly defaultExpanded?: boolean;
} & PropsOf<typeof DocumentChips>;

const DocumentCard = ({
	document,
	VersionsButton = DocumentVersionsButton,
	defaultExpanded = false,
	...rest
}: Props) => {
	const [linking, setLinking] = useState(false);
	const [unlinking, setUnlinking] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [restoring, setRestoring] = useState(false);
	const [superdeleting, setSuperdeleting] = useState(false);

	const {patientId, deleted} = document;

	return (
		<Accordion
			defaultExpanded={defaultExpanded}
			TransitionProps={{unmountOnExit: true}}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Chips>
					<DocumentChips document={document} {...rest} />
				</Chips>
			</AccordionSummary>
			<AccordionDetails>
				<List>
					<DocumentCardListItem document={document} />
				</List>
			</AccordionDetails>
			<Divider />
			<AccordionActions>
				{VersionsButton && <VersionsButton document={document} />}
				<DocumentDownloadButton document={document} />
				<Button
					color="primary"
					onClick={() => {
						setLinking(true);
					}}
				>
					Link
					<LinkIcon />
				</Button>
				{patientId && (
					<Button
						color="secondary"
						onClick={() => {
							setUnlinking(true);
						}}
					>
						Unlink
						<LinkOffIcon />
					</Button>
				)}
				{deleted && (
					<Button
						color="primary"
						onClick={() => {
							setRestoring(true);
						}}
					>
						Restore
						<RestoreFromTrashIcon />
					</Button>
				)}
				{deleted && (
					<Button
						color="secondary"
						onClick={() => {
							setSuperdeleting(true);
						}}
					>
						Delete forever
						<DeleteForeverIcon />
					</Button>
				)}
				<DocumentDeletionButton document={document} />
				<DocumentLinkingDialog
					open={linking}
					document={document}
					existingLink={patientId ? {_id: patientId} : undefined}
					onClose={() => {
						setLinking(false);
					}}
				/>
				<DocumentUnlinkingDialog
					open={unlinking}
					document={document}
					onClose={() => {
						setUnlinking(false);
					}}
				/>
				<DocumentDeletionDialog
					open={deleting}
					document={document}
					onClose={() => {
						setDeleting(false);
					}}
				/>
				<DocumentRestorationDialog
					open={restoring}
					document={document}
					onClose={() => {
						setRestoring(false);
					}}
				/>
				<DocumentSuperDeletionDialog
					open={superdeleting}
					document={document}
					onClose={() => {
						setSuperdeleting(false);
					}}
				/>
			</AccordionActions>
		</Accordion>
	);
};

type DocumentCardListItemProps = {
	readonly document: DocumentDocument;
};

const DocumentCardListItem = ({document}: DocumentCardListItemProps) => {
	const {parsed, format, kind} = document;

	if (parsed) {
		// eslint-disable-next-line default-case
		switch (format) {
			case 'healthone': {
				// eslint-disable-next-line default-case
				switch (kind) {
					case 'lab': {
						return (
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<TableChartIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									disableTypography
									primary={<Typography variant="subtitle1">Table</Typography>}
									secondary={<HealthOneLabResultsTable document={document} />}
								/>
							</ListItem>
						);
					}

					case 'report': {
						return (
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<SubjectIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									disableTypography
									primary={
										<Typography variant="subtitle1">Contents</Typography>
									}
									secondary={<ReportContents document={document} />}
								/>
							</ListItem>
						);
					}
				}
			}
		}
	}

	return (
		<ListItem>
			<ListItemAvatar>
				<Avatar>
					<FileCopyIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				disableTypography
				primary={<Typography variant="subtitle1">Source</Typography>}
				secondary={<DocumentSource document={document} />}
			/>
		</ListItem>
	);
};

export default DocumentCard;
