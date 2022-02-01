import React from 'react';
import {useParams} from 'react-router-dom';

import {books} from '../../api/books';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../util/uri';

import TagDetails from '../tags/TagDetails';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import PagedConsultationsList from '../consultations/PagedConsultationsList';

import useConsultationsUnpaged from '../consultations/useConsultationsUnpaged';

interface Params {
	book: string;
	year: string;
	page?: string;
}

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const BookDetails = ({defaultPage = 1, defaultPerpage = 100}: Props) => {
	const params = useParams<Params>();
	const year = params.year;
	const book = myDecodeURIComponent(params.book);
	const page = Number.parseInt(params.page, 10) || defaultPage;
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
			root={`/book/${year}/${myEncodeURIComponent(book)}`}
			useParents={useConsultationsUnpaged}
			selector={books.selector(name)}
			sort={{datetime: 1}}
			page={page}
			perpage={perpage}
		/>
	);
};

export default BookDetails;
