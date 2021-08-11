import React from 'react';
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails';

import ReactivePatientChip from '../patients/ReactivePatientChip';
import PagedConsultationsList from '../consultations/PagedConsultationsList';

import {useConsultationsFind} from '../../api/consultations';

import {books} from '../../api/books';

import {myEncodeURIComponent, myDecodeURIComponent} from '../../client/uri';

export default function BookDetails({match, year, book, page, perpage}) {
	year = (match && match.params.year) || year;
	book = (match && myDecodeURIComponent(match.params.book)) || book;
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;

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
			useParents={useConsultationsFind}
			selector={books.selector(name)}
			sort={{datetime: 1}}
			page={page}
			perpage={perpage}
		/>
	);
}

BookDetails.defaultProps = {
	page: 1,
	perpage: 100,
};

BookDetails.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
};
