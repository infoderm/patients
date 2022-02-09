import React from 'react';

import {styled} from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AccordionSummary from '@mui/material/AccordionSummary';

import StaticConsultationCardChips from './StaticConsultationCardChips';

const PREFIX = 'StaticConsultationCardSummary';

const classes = {
	summary: `${PREFIX}-summary`,
};

const StyledAccordionSummary = styled(AccordionSummary)({
	[`&.${classes.summary}`]: {
		position: 'relative',
	},
});

const StaticConsultationCardSummary = (props) => {
	return (
		<StyledAccordionSummary
			className={classes.summary}
			expandIcon={<ExpandMoreIcon />}
		>
			<StaticConsultationCardChips {...props} />
		</StyledAccordionSummary>
	);
};

export default StaticConsultationCardSummary;
