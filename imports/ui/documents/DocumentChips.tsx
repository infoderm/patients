import React, {useState} from 'react';

import {styled, useTheme} from '@mui/material/styles';

import MuiChip from '@mui/material/Chip';

import ErrorIcon from '@mui/icons-material/Error';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import BugReportIcon from '@mui/icons-material/BugReport';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import UnstyledLinkChip from '../chips/LinkChip';

import {useDateFormat} from '../../i18n/datetime';

import {myEncodeURIComponent} from '../../util/uri';

import {DocumentDocument} from '../../api/collection/documents';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentVersionsChip from './DocumentVersionsChip';

const chipMargins = (theme) => ({
	marginRight: theme.spacing(1),
	marginTop: theme.spacing(1 / 2),
	marginBottom: theme.spacing(1 / 2),
});

interface AdditionalLinkChipProps {
	maxWidth?: boolean;
}

const LinkChip = styled(UnstyledLinkChip, {
	shouldForwardProp: (prop) => prop !== 'maxWidth',
})<AdditionalLinkChipProps>(({theme, maxWidth}) => ({
	...chipMargins(theme),
	...(maxWidth && {
		maxWidth: '200px',
	}),
}));

interface ChipProps {
	maxWidth?: boolean;
	kind?: string;
}

const Chip = styled(MuiChip, {
	shouldForwardProp: (prop) => prop !== 'maxWidth' && prop !== 'kind',
})<ChipProps>(({theme, maxWidth, kind}) => ({
	...chipMargins(theme),
	...(maxWidth && {
		maxWidth: '200px',
	}),
	...(kind === 'unlinked' && {
		backgroundColor: '#f88',
		color: '#fff',
		fontWeight: 'bold',
	}),
	...(kind === 'linkoff' && {
		backgroundColor: '#f88',
		color: '#fff',
	}),
	...(kind === 'anomalies' && {
		backgroundColor: '#fa8',
	}),
	...(kind === 'partial' && {
		backgroundColor: '#fa8',
	}),
	...(kind === 'complete' && {
		backgroundColor: '#8fa',
	}),
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
	const theme = useTheme();
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

	const localizedDate = useDateFormat('PPPP');

	return (
		<>
			{parsed ? (
				<Chip label={localizedDate(datetime)} />
			) : (
				<Chip label={localizedDate(createdAt)} />
			)}
			{parsed && (
				<LinkChip
					maxWidth
					icon={<BusinessIcon />}
					to={`/documents/filterBy/identifier/${myEncodeURIComponent(
						identifier,
					)}`}
					label={identifier}
				/>
			)}
			{parsed && (
				<LinkChip
					maxWidth
					icon={<ConfirmationNumberIcon />}
					to={`/document/versions/${myEncodeURIComponent(
						identifier,
					)}/${myEncodeURIComponent(reference)}`}
					label={reference}
				/>
			)}
			{parsed ? null : <Chip icon={<BugReportIcon />} label="parsing error" />}
			{PatientChip && patientId && (
				<PatientChip style={chipMargins(theme)} patient={{_id: patientId}} />
			)}
			{patientId ? null : parsed ? (
				<Chip
					icon={<LinkOffIcon />}
					label={`${subject.lastname} ${subject.firstname}`}
					kind="unlinked"
					onClick={(e) => {
						e.stopPropagation();
						setLinking(true);
					}}
				/>
			) : (
				<Chip
					icon={<LinkOffIcon />}
					label="not linked"
					kind="linkoff"
					onClick={(e) => {
						e.stopPropagation();
						setLinking(true);
					}}
				/>
			)}
			{parsed && kind === 'lab' && anomalies ? (
				<Chip icon={<ErrorIcon />} label={anomalies} kind="anomalies" />
			) : null}
			{parsed && status && status === 'partial' ? (
				<Chip icon={<HourglassEmptyIcon />} label={status} kind="partial" />
			) : null}
			{parsed && status && status === 'complete' ? (
				<Chip icon={<DoneIcon />} label={status} kind="complete" />
			) : null}
			{deleted && (
				<Chip icon={<DeleteIcon />} label="deleted" color="secondary" />
			)}
			{!deleted && VersionsChip && (
				<VersionsChip style={chipMargins(theme)} document={document} />
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
