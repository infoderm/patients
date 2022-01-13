import React from 'react';
import {match} from 'react-router-dom';

import {books} from '../../api/books';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../util/uri';

import TagDetails from '../tags/TagDetails';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import PagedConsultationsList from '../consultations/PagedConsultationsList';

import useConsultationsUnpaged from '../consultations/useConsultationsUnpaged';

interface Params {
	book: string;
	year: string;
	page: string;
}

interface Props {
	match?: match<Params>;
	year?: string;
	book?: string;
	page?: number;
	perpage?: number;
}

const BookDetails = ({match, year, book, page = 1, perpage = 100}: Props) => {
	year = match?.params.year || year;
	book = (match && myDecodeURIComponent(match.params.book)) || book;
	page = Number.parseInt(match?.params.page, 10) || page;

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
