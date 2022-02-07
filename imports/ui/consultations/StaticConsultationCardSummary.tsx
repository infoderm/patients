import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AccordionSummary from '@mui/material/AccordionSummary';

import StaticConsultationCardChips from './StaticConsultationCardChips';

const useStyles = makeStyles({
	summary: {
		position: 'relative',
	},
});

const StaticConsultationCardSummary = (props) => {
	const classes = useStyles();

	return (
		<AccordionSummary
			className={classes.summary}
			expandIcon={<ExpandMoreIcon />}
		>
			<StaticConsultationCardChips {...props} />
		</AccordionSummary>
	);
};

export default StaticConsultationCardSummary;
