import React from 'react';

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

interface StaticConsultationCardProps {
	consultation: any;
	loading?: boolean;
	found?: boolean;
	attachments?: any[];
	PatientChip?: JSX.Element;
	showPrice?: boolean;
	defaultExpanded?: boolean;
}

const StaticConsultationCard = (props: StaticConsultationCardProps) => {
	const classes = useStyles();

	const {
		consultation,
		loading = false,
		found = true,
		defaultExpanded = false,
	} = props;

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

	const cardOpacity = {opacity: loading ? 0.7 : deleted ? 0.4 : 1};

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

export default StaticConsultationCard;
