import React from 'react';

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {type ParsedDocumentDocument} from '../../api/collection/documents';

const Root = styled('div')(({theme}) => ({
	maxWidth: 1200,
	margin: '0 auto',
	marginTop: theme.spacing(3),
	textAlign: 'center',
}));

const StyledPaper = styled(Paper)(({theme}) => ({
	display: 'inline-block',
	whiteSpace: 'pre-wrap',
	padding: theme.spacing(3),
}));

type Props = {
	document: ParsedDocumentDocument;
};

const HealthOneReportContents = ({document}: Props) => {
	return (
		<Root>
			<StyledPaper>{document.text.join('\n').trim()}</StyledPaper>
		</Root>
	);
};

export default HealthOneReportContents;
