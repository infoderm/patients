import React, {Fragment} from 'react';

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import {Divider, Typography, type TypographyProps} from '@mui/material';

import {type ParsedDocumentDocument} from '../../api/collection/documents';

const Root = styled('div')(({theme}) => ({
	maxWidth: 1200,
	margin: '0 auto',
	marginTop: theme.spacing(3),
	textAlign: 'center',
}));

const StyledPaper = styled(Paper)(() => ({
	display: 'inline-block',
}));

const UnstyledSection = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="body1" {...props} />
);

const Section = styled(UnstyledSection)(({theme}) => ({
	whiteSpace: 'pre-wrap',
	padding: theme.spacing(3),
}));

type Props = {
	readonly document: ParsedDocumentDocument;
};

const HealthOneReportContents = ({document}: Props) => {
	// TODO: Change type expectations and display loading indicator.
	if (document.sections === undefined) return null;

	return (
		<Root>
			<StyledPaper>
				{document.sections.map(({text}, i) => (
					<Fragment key={i}>
						{i !== 0 && <Divider />}
						<Section>{text.join('\n').trim()}</Section>
					</Fragment>
				))}
			</StyledPaper>
		</Root>
	);
};

export default HealthOneReportContents;
