import React, {useState} from 'react';

import {Link} from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';

import Chip from '@mui/material/Chip';

import ErrorIcon from '@mui/icons-material/Error';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import BugReportIcon from '@mui/icons-material/BugReport';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import {useDateFormat} from '../../i18n/datetime';

import {myEncodeURIComponent} from '../../util/uri';

import {DocumentDocument} from '../../api/collection/documents';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentVersionsChip from './DocumentVersionsChip';

const useStyles = makeStyles((theme) => ({
	chip: {
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(1 / 2),
		marginBottom: theme.spacing(1 / 2),
	},
	maxWidthChip: {
		maxWidth: '200px',
	},
	unlinkedpatientchip: {
		backgroundColor: '#f88',
		color: '#fff',
		fontWeight: 'bold',
	},
	linkoffchip: {
		backgroundColor: '#f88',
		color: '#fff',
	},
	anomalieschip: {
		backgroundColor: '#fa8',
	},
	partialchip: {
		backgroundColor: '#fa8',
	},
	completechip: {
		backgroundColor: '#8fa',
	},
}));

interface Props {
	document: DocumentDocument;
	PatientChip?: React.ElementType;
	VersionsChip?: React.ElementType;
}

const DocumentChips = ({
	document,
	PatientChip = ReactivePatientChip,
	VersionsChip = DocumentVersionsChip,
}: Props) => {
	const [linking, setLinking] = useState(false);

	const {
		createdAt,
		patientId,
		parsed,
		kind,
		identifier,
		reference,
		status,
		datetime,
		deleted,
		patient: subject,
		anomalies,
	} = document;

	const classes = useStyles();

	const localizedDate = useDateFormat('PPPP');

	return (
		<>
			{parsed ? (
				<Chip label={localizedDate(datetime)} className={classes.chip} />
			) : (
				<Chip label={localizedDate(createdAt)} className={classes.chip} />
			)}
			{parsed && (
				<Chip
					icon={<BusinessIcon />}
					component={Link}
					to={`/documents/filterBy/identifier/${myEncodeURIComponent(
						identifier,
					)}`}
					label={identifier}
					className={classNames(classes.chip, classes.maxWidthChip)}
				/>
			)}
			{parsed && (
				<Chip
					icon={<ConfirmationNumberIcon />}
					component={Link}
					to={`/document/versions/${myEncodeURIComponent(
						identifier,
					)}/${myEncodeURIComponent(reference)}`}
					label={reference}
					className={classNames(classes.chip, classes.maxWidthChip)}
				/>
			)}
			{parsed ? null : (
				<Chip
					icon={<BugReportIcon />}
					label="parsing error"
					className={classes.chip}
				/>
			)}
			{PatientChip && patientId && (
				<PatientChip className={classes.chip} patient={{_id: patientId}} />
			)}
			{patientId ? null : parsed ? (
				<Chip
					icon={<LinkOffIcon />}
					label={`${subject.lastname} ${subject.firstname}`}
					className={classNames(classes.chip, classes.unlinkedpatientchip)}
					onClick={(e) => {
						e.stopPropagation();
						setLinking(true);
					}}
				/>
			) : (
				<Chip
					icon={<LinkOffIcon />}
					label="not linked"
					className={classNames(classes.chip, classes.linkoffchip)}
					onClick={(e) => {
						e.stopPropagation();
						setLinking(true);
					}}
				/>
			)}
			{parsed && kind === 'lab' && anomalies ? (
				<Chip
					icon={<ErrorIcon />}
					label={anomalies}
					className={classNames(classes.chip, classes.anomalieschip)}
				/>
			) : null}
			{parsed && status && status === 'partial' ? (
				<Chip
					icon={<HourglassEmptyIcon />}
					label={status}
					className={classNames(classes.chip, classes.partialchip)}
				/>
			) : null}
			{parsed && status && status === 'complete' ? (
				<Chip
					icon={<DoneIcon />}
					label={status}
					className={classNames(classes.chip, classes.completechip)}
				/>
			) : null}
			{deleted && (
				<Chip
					icon={<DeleteIcon />}
					label="deleted"
					color="secondary"
					className={classes.chip}
				/>
			)}
			{!deleted && VersionsChip && (
				<VersionsChip document={document} className={classes.chip} />
			)}
			{!patientId && (
				<DocumentLinkingDialog
					open={linking}
					document={document}
					onClose={() => {
						setLinking(false);
					}}
				/>
			)}
		</>
	);
};

DocumentChips.projection = {
	// ...DocumentLinkingDialog.projection,

	// _id: 1,
	// createdAt: 1,
	// patientId: 1,
	// parsed: 1,
	// format: 1,
	// kind: 1,
	// identifier: 1,
	// reference: 1,
	// status: 1,
	// datetime: 1,
	// patient: 1,
	// anomalies: 1,
	// deleted: 1,
	// lastVersion: 1,

	source: 0,
	decoded: 0,
	results: 0,
	text: 0,
};

export default DocumentChips;
