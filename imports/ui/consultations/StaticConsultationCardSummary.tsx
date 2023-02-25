import React from 'react';

import {styled} from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AccordionSummary from '@mui/material/AccordionSummary';

import type PropsOf from '../../lib/types/PropsOf';

import StaticConsultationCardChips from './StaticConsultationCardChips';

const StyledAccordionSummary = styled(AccordionSummary)({
	position: 'relative',
});

const StaticConsultationCardSummary = (
	props: PropsOf<typeof StaticConsultationCardChips>,
) => {
	return (
		<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
			<StaticConsultationCardChips {...props} />
		</StyledAccordionSummary>
	);
};

export default StaticConsultationCardSummary;
