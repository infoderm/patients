import React from 'react';

import {useConsultationsWithPriceZeroNotInBookZero} from '../../api/issues';

import paged from '../routes/paged';

import makeConsultationsPage from '../consultations/makeConsultationsPage';

import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsPage = makeConsultationsPage(
	useConsultationsWithPriceZeroNotInBookZero,
);
const ConsultationsPager = paged(ConsultationsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const ConsultationsWithPriceZeroNotInBookZero = (props: Props) => {
	return (
		<div {...props}>
			<ConsultationsPager
				sort={{
					datetime: -1,
				}}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All price 0 consultations are in book 0 :)</>
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

export default ConsultationsWithPriceZeroNotInBookZero;
