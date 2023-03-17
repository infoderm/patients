import React from 'react';

import {books} from '../../api/books';

import TagDetails from '../tags/TagDetails';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import PagedConsultationsList from '../consultations/PagedConsultationsList';

import useConsultationsUnpaged from '../consultations/useConsultationsUnpaged';

type Props = {
	year: string;
	book: string;
	page: number;
	defaultPerpage?: number;
};

const BookDetails = ({year, book, page, defaultPerpage = 100}: Props) => {
	const perpage = defaultPerpage;

	const name = books.format(year, book);

	return (
		<TagDetails
			name={name}
			List={PagedConsultationsList}
			listProps={{
				itemProps: {
					showPrice: true,
					PatientChip: ReactivePatientChip,
				},
			}}
			useParents={useConsultationsUnpaged}
			filter={books.filter(name)}
			sort={{datetime: 1}}
			page={page}
			perpage={perpage}
		/>
	);
};

export default BookDetails;
