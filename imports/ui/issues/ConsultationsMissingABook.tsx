import React from 'react';

import {useConsultationsMissingABook} from '../../api/issues';

import paged from '../routes/paged';

import makeConsultationsPage from '../consultations/makeConsultationsPage';

import ReactivePatientChip from '../patients/ReactivePatientChip';

const ConsultationsPage = makeConsultationsPage(useConsultationsMissingABook);
const ConsultationsPager = paged(ConsultationsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const ConsultationsMissingABook = (props: Props) => {
	return (
		<div {...props}>
			<ConsultationsPager
				sort={{
					datetime: -1,
				}}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All consultations have a book :)</>
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

export default ConsultationsMissingABook;
