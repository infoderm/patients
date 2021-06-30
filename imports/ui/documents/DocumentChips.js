import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

import ErrorIcon from '@material-ui/icons/Error';
import BusinessIcon from '@material-ui/icons/Business';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import BugReportIcon from '@material-ui/icons/BugReport';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import DoneIcon from '@material-ui/icons/Done';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import {useDateFormat} from '../../i18n/datetime';

import {myEncodeURIComponent} from '../../client/uri';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentVersionsChip from './DocumentVersionsChip';

const useStyles = makeStyles((theme) => ({
	chip: {
		maxWidth: '200px',
		marginRight: theme.spacing(1)
	},
	unlinkedpatientchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff',
		fontWeight: 'bold'
	},
	linkoffchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff'
	},
	anomalieschip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#fa8'
	},
	partialchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#fa8'
	},
	completechip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#8fa'
	}
}));

const DocumentChips = (props) => {
	const [linking, setLinking] = useState(false);

	const {
		PatientChip,
		VersionsChip,
		document: {
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
			anomalies
		}
	} = props;

	const {document} = props;

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
					to={`/documents/${myEncodeURIComponent(identifier)}`}
					label={identifier}
					className={classes.chip}
				/>
			)}
			{parsed && (
				<Chip
					icon={<ConfirmationNumberIcon />}
					component={Link}
					to={`/document/versions/${myEncodeURIComponent(
						identifier
					)}/${myEncodeURIComponent(reference)}`}
					label={reference}
					className={classes.chip}
				/>
			)}
			{parsed ? null : (
				<Chip
					icon={<BugReportIcon />}
					label="parsing error"
					className={classes.chip}
				/>
			)}
			{PatientChip && patientId && <PatientChip patient={{_id: patientId}} />}
			{patientId ? null : parsed ? (
				<Chip
					icon={<LinkOffIcon />}
					label={`${subject.lastname} ${subject.firstname}`}
					className={classes.unlinkedpatientchip}
					onClick={(e) => {
						e.stopPropagation();
						setLinking(true);
					}}
				/>
			) : (
				<Chip
					icon={<LinkOffIcon />}
					label="not linked"
					className={classes.linkoffchip}
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
					className={classes.anomalieschip}
				/>
			) : null}
			{parsed && status && status === 'partial' ? (
				<Chip
					icon={<HourglassEmptyIcon />}
					label={status}
					className={classes.partialchip}
				/>
			) : null}
			{parsed && status && status === 'complete' ? (
				<Chip
					icon={<DoneIcon />}
					label={status}
					className={classes.completechip}
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
			{!deleted && VersionsChip && <VersionsChip document={document} />}
			{!patientId && (
				<DocumentLinkingDialog
					open={linking}
					document={document}
					onClose={() => setLinking(false)}
				/>
			)}
		</>
	);
};

DocumentChips.defaultProps = {
	PatientChip: ReactivePatientChip,
	VersionsChip: DocumentVersionsChip
};

DocumentChips.propTypes = {
	document: PropTypes.object.isRequired,
	PatientChip: PropTypes.elementType,
	VersionsChip: PropTypes.elementType
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
	text: 0
};

export default DocumentChips;
