import React from 'react';

import {styled} from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import Divider from '@mui/material/Divider';

import PropsOf from '../../util/PropsOf';

import virtualFields from '../../api/consultations/virtualFields';

import StaticConsultationCardSummary from './StaticConsultationCardSummary';
import StaticConsultationCardDetails from './StaticConsultationCardDetails';
import StaticConsultationCardActions from './StaticConsultationCardActions';

interface AdditionalProps {
	loading: boolean;
	deleted: boolean;
	isAppointment: boolean;
	didNotOrWillNotHappen: boolean;
}

const additionalProps = new Set<number | string | Symbol>([
	'didNotOrWillNotHappen',
	'loading',
	'deleted',
	'isAppointment',
]);
const shouldForwardProp = (prop) => !additionalProps.has(prop);
const Accordion = styled(MuiAccordion, {shouldForwardProp})<AdditionalProps>(
	({loading, deleted, isAppointment, didNotOrWillNotHappen}) => ({
		transition: 'opacity 500ms ease-out',
		backgroundColor: didNotOrWillNotHappen
			? '#ccc'
			: isAppointment
			? '#FFF5D6'
			: undefined,
		opacity: loading ? 0.7 : deleted ? 0.4 : 1,
	}),
);

type StaticConsultationCardProps = {
	consultation: any;
	loading?: boolean;
	found?: boolean;
	defaultExpanded?: boolean;
} & Omit<
	PropsOf<typeof StaticConsultationCardSummary> &
		PropsOf<typeof StaticConsultationCardActions> &
		PropsOf<typeof StaticConsultationCardDetails>,
	| 'deleted'
	| 'didNotOrWillNotHappen'
	| 'isNoShow'
	| 'missingPaymentData'
	| 'owes'
	| 'owed'
>;

const StaticConsultationCard = (props: StaticConsultationCardProps) => {
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

	return (
		<Accordion
			defaultExpanded={defaultExpanded}
			TransitionProps={{unmountOnExit: true}}
			loading={loading}
			deleted={deleted}
			isAppointment={isAppointment}
			didNotOrWillNotHappen={didNotOrWillNotHappen}
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
