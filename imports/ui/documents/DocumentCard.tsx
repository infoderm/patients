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

import type PropsOf from '../../util/types/PropsOf';

import {type DocumentDocument} from '../../api/collection/documents';

import DocumentChips from './DocumentChips';
import DocumentVersionsButton from './actions/DocumentVersionsButton';

import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentUnlinkingDialog from './DocumentUnlinkingDialog';
import HealthOneLabResultsTable from './HealthOneLabResultsTable';
import ReportContents from './ReportContents';
import DocumentSource from './DocumentSource';
import DocumentDownloadButton from './actions/DocumentDownloadButton';
import DocumentDeletionButton from './actions/DocumentDeletionButton';
import DocumentSuperDeletionButton from './actions/DocumentSuperDeletionButton';
import DocumentRestorationButton from './actions/DocumentRestorationButton';

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

	const {patientId} = document;

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
				<DocumentRestorationButton hideWhenDisabled document={document} />
				<DocumentSuperDeletionButton hideWhenDisabled document={document} />
				<DocumentDeletionButton hideWhenDisabled document={document} />
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
		switch (kind) {
			case 'lab': {
				// eslint-disable-next-line default-case
				switch (format) {
					case 'healthone': {
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
				}

				break;
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
							primary={<Typography variant="subtitle1">Contents</Typography>}
							secondary={<ReportContents document={document} />}
						/>
					</ListItem>
				);
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
