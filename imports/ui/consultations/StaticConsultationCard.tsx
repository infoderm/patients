import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import Accordion from '@material-ui/core/Accordion';

import Divider from '@material-ui/core/Divider';

import virtualFields from '../../api/consultations/virtualFields';

import StaticConsultationCardSummary from './StaticConsultationCardSummary';
import StaticConsultationCardDetails from './StaticConsultationCardDetails';
import StaticConsultationCardActions from './StaticConsultationCardActions';

const useStyles = makeStyles(() => ({
	card: {
		transition: 'opacity 500ms ease-out',
	},
	appointment: {
		backgroundColor: '#FFF5D6',
	},
	didNotOrWillNotHappen: {
		backgroundColor: '#ccc',
	},
}));

const StaticConsultationCard = (props) => {
	const classes = useStyles();

	const {loading, found, defaultExpanded, consultation} = props;

	const deleted = !loading && !found;

	const {
		didNotOrWillNotHappen,
		isAppointment,
		isNoShow,
		missingPaymentData,
		owes,
		owed,
	} = virtualFields(consultation);

	const extraProps = {
		deleted,
		didNotOrWillNotHappen,
		isNoShow,
		missingPaymentData,
		owes,
		owed,
	};

	const cardOpacity = {opacity: deleted ? 0.4 : 1};

	return (
		<Accordion
			defaultExpanded={defaultExpanded}
			TransitionProps={{unmountOnExit: true}}
			className={classNames(classes.card, {
				[classes.appointment]: isAppointment,
				[classes.didNotOrWillNotHappen]: didNotOrWillNotHappen,
			})}
			style={cardOpacity}
		>
			<StaticConsultationCardSummary {...props} {...extraProps} />
			<StaticConsultationCardDetails {...props} {...extraProps} />
			<Divider />
			<StaticConsultationCardActions {...props} {...extraProps} />
		</Accordion>
	);
};

StaticConsultationCard.projection = undefined;

StaticConsultationCard.defaultProps = {
	loading: false,
	found: true,
	PatientChip: undefined,
	showPrice: false,
	defaultExpanded: false,
};

StaticConsultationCard.propTypes = {
	loading: PropTypes.bool,
	found: PropTypes.bool,
	consultation: PropTypes.object.isRequired,
	attachments: PropTypes.array,
	PatientChip: PropTypes.elementType,
	showPrice: PropTypes.bool,
	defaultExpanded: PropTypes.bool,
};

export default StaticConsultationCard;
