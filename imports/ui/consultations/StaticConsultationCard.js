import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';

import Divider from '@material-ui/core/Divider';

import StaticConsultationCardSummary from './StaticConsultationCardSummary.js';
import StaticConsultationCardDetails from './StaticConsultationCardDetails.js';
import StaticConsultationCardActions from './StaticConsultationCardActions.js';

const useStyles = makeStyles(() => ({
	card: {
		transition: 'opacity 500ms ease-out'
	}
}));

const StaticConsultationCard = (props) => {
	const classes = useStyles();

	const {
		loading,
		found,
		defaultExpanded,
		consultation: {currency, price, paid}
	} = props;

	const deleted = !loading && !found;
	const missingPaymentData =
		currency === undefined || price === undefined || paid === undefined;
	const owes = !(missingPaymentData || paid === price);
	const owed = owes ? price - paid : 0;

	const cardOpacity = {opacity: deleted ? 0.4 : 1};

	const extraProps = {
		deleted,
		missingPaymentData,
		owes,
		owed
	};

	return (
		<Accordion
			defaultExpanded={defaultExpanded}
			TransitionProps={{unmountOnExit: true}}
			className={classes.card}
			style={cardOpacity}
		>
			<StaticConsultationCardSummary {...props} {...extraProps} />
			<StaticConsultationCardDetails {...props} {...extraProps} />
			<Divider />
			<StaticConsultationCardActions {...props} {...extraProps} />
		</Accordion>
	);
};

StaticConsultationCard.defaultProps = {
	loading: false,
	found: true,
	PatientChip: undefined,
	showPrice: false,
	defaultExpanded: false
};

StaticConsultationCard.propTypes = {
	loading: PropTypes.bool,
	found: PropTypes.bool,
	consultation: PropTypes.object.isRequired,
	PatientChip: PropTypes.elementType,
	showPrice: PropTypes.bool,
	defaultExpanded: PropTypes.bool
};

export default StaticConsultationCard;
