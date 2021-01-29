import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import TableChartIcon from '@material-ui/icons/TableChart';
import SubjectIcon from '@material-ui/icons/Subject';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import saveTextAs from '../../client/saveTextAs';

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

const DocumentCard = (props) => {
	const [linking, setLinking] = useState(false);
	const [unlinking, setUnlinking] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [restoring, setRestoring] = useState(false);
	const [superdeleting, setSuperdeleting] = useState(false);

	const classes = useStyles();

	const {PatientChip, VersionsChip, VersionsButton, defaultExpanded, document} =
		props;

	const {patientId, parsed, format, kind, deleted} = document;

	const download = (_event) => {
		const extensions = {
			healthone: 'HLT',
			// 'medar' : 'MDR' ,
			// 'medidoc' : 'MDD' ,
		};

		const ext = extensions[document.format] || 'UNK';

		const name = document.parsed
			? `${document.identifier}-${document.reference}-${document.status}`
			: `${document._id}`;

		const filename = `${name}.${ext}`;

		saveTextAs(document.decoded || document.source, filename);
	};

	return (
		<Accordion
			defaultExpanded={defaultExpanded}
			TransitionProps={{unmountOnExit: true}}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<div className={classes.chips}>
					<DocumentChips
						document={document}
						VersionsChip={VersionsChip}
						PatientChip={PatientChip}
					/>
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
				<Button color="primary" onClick={download}>
					Download
					<CloudDownloadIcon />
				</Button>
				<Button color="primary" onClick={() => setLinking(true)}>
					Link
					<LinkIcon />
				</Button>
				{patientId && (
					<Button color="secondary" onClick={() => setUnlinking(true)}>
						Unlink
						<LinkOffIcon />
					</Button>
				)}
				{deleted && (
					<Button color="primary" onClick={() => setRestoring(true)}>
						Restore
						<RestoreFromTrashIcon />
					</Button>
				)}
				{deleted && (
					<Button color="secondary" onClick={() => setSuperdeleting(true)}>
						Delete forever
						<DeleteForeverIcon />
					</Button>
				)}
				{!deleted && (
					<Button color="secondary" onClick={() => setDeleting(true)}>
						Delete
						<DeleteIcon />
					</Button>
				)}
				<DocumentLinkingDialog
					open={linking}
					document={document}
					existingLink={{_id: patientId}}
					onClose={() => setLinking(false)}
				/>
				<DocumentUnlinkingDialog
					open={unlinking}
					document={document}
					onClose={() => setUnlinking(false)}
				/>
				<DocumentDeletionDialog
					open={deleting}
					document={document}
					onClose={() => setDeleting(false)}
				/>
				<DocumentRestorationDialog
					open={restoring}
					document={document}
					onClose={() => setRestoring(false)}
				/>
				<DocumentSuperDeletionDialog
					open={superdeleting}
					document={document}
					onClose={() => setSuperdeleting(false)}
				/>
			</AccordionActions>
		</Accordion>
	);
};

DocumentCard.defaultProps = {
	PatientChip: DocumentChips.defaultProps.PatientChip,
	VersionsChip: DocumentChips.defaultProps.VersionsChip,
	VersionsButton: DocumentVersionsButton,
	defaultExpanded: false,
};

DocumentCard.propTypes = {
	document: PropTypes.object.isRequired,
	PatientChip: PropTypes.elementType,
	VersionsChip: PropTypes.elementType,
	VersionsButton: PropTypes.elementType,
	defaultExpanded: PropTypes.bool,
};

export default DocumentCard;
