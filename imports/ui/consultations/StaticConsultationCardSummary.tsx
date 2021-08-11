import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AccordionSummary from '@material-ui/core/AccordionSummary';

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
