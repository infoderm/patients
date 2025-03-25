import React from 'react';

import {useConsultationsMissingPaymentData} from '../../api/issues';

import paged from '../routes/paged';

import makeConsultationsPage from '../consultations/makeConsultationsPage';

import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsPage = makeConsultationsPage(
	useConsultationsMissingPaymentData,
);
const ConsultationsPager = paged(ConsultationsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const ConsultationsMissingPaymentData = (props: Props) => {
	return (
		<div {...props}>
			<ConsultationsPager
				filter={{
					isDone: true,
					datetime: {$gte: new Date(2020, 0, 1)},
					$or: [
						{price: {$not: {$type: 1}}},
						{price: Number.NaN},
						{paid: {$not: {$type: 1}}},
						{paid: Number.NaN},
						{currency: {$not: {$type: 2}}},
						{payment_method: {$not: {$type: 2}}},
					],
				}}
				sort={{
					datetime: -1,
				}}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All consultations have payment data :)</>
					) : (
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<>{`Nothing to see on page ${page}.`}</>
					)
				}
				itemProps={{
					PatientChip: ReactivePatientChip,
				}}
			/>
		</div>
	);
};

export default ConsultationsMissingPaymentData;
