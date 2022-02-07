import React, {useState} from 'react';

import {makeStyles, createStyles} from '@mui/styles';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
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

import PropsOf from '../../util/PropsOf';

import DocumentChips from './DocumentChips';
import DocumentVersionsButton from './actions/DocumentVersionsButton';

import DocumentDeletionDialog from './DocumentDeletionDialog';
import DocumentSuperDeletionDialog from './DocumentSuperDeletionDialog';
import DocumentRestorationDialog from './DocumentRestorationDialog';
import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentUnlinkingDialog from './DocumentUnlinkingDialog';
import HealthOneLabResultsTable from './HealthOneLabResultsTable';
import HealthOneReportContents from './HealthOneReportContents';
import DocumentSource from './DocumentSource';
import DocumentDownloadButton from './actions/DocumentDownloadButton';
import DocumentDeletionButton from './actions/DocumentDeletionButton';

const styles = () =>
	createStyles({
		chips: {
			display: 'flex',
			justifyContent: 'center',
			flexWrap: 'wrap',
		},
		list: {
			width: '100%',
		},
	});

const useStyles = makeStyles(styles);

interface Props extends PropsOf<typeof DocumentChips> {
	VersionsButton?: React.ElementType;
	defaultExpanded?: boolean;
}

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

	const classes = useStyles();

	const {patientId, parsed, format, kind, deleted} = document;

	return (
		<Accordion
			defaultExpanded={defaultExpanded}
			TransitionProps={{unmountOnExit: true}}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<div className={classes.chips}>
					<DocumentChips document={document} {...rest} />
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<List className={classes.list}>
					{parsed && format === 'healthone' && kind === 'lab' && (
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<TableChartIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								disableTypography
								primary={<Typography variant="subtitle1">Results</Typography>}
								secondary={<HealthOneLabResultsTable document={document} />}
							/>
						</ListItem>
					)}
					{parsed && format === 'healthone' && kind === 'report' && (
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<SubjectIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								disableTypography
								primary={<Typography variant="subtitle1">Contents</Typography>}
								secondary={<HealthOneReportContents document={document} />}
							/>
						</ListItem>
					)}
					{(!parsed || format !== 'healthone') && (
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
					)}
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
					existingLink={{_id: patientId}}
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

export default DocumentCard;
