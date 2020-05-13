import React from 'react' ;
import PropTypes from 'prop-types';

import TagDetails from '../tags/TagDetails.js';

import PagedConsultationsList from '../consultations/PagedConsultationsList.js';

import { Consultations } from '../../api/consultations.js';

import { books } from '../../api/books.js';

import { myEncodeURIComponent } from '../../client/uri.js';
import { myDecodeURIComponent } from '../../client/uri.js';

export default function BookDetails ( { match , year , book , page , perpage } ) {

	year = match && match.params.year || year ;
	book = match && myDecodeURIComponent(match.params.book) || book ;
	page = match && match.params.page && parseInt(match.params.page,10) || page ;

	const name = books.format( year , book ) ;

	return (
		<TagDetails
			root={`/book/${year}/${myEncodeURIComponent(book)}`}
			name={name}
			page={page}
			perpage={perpage}
			collection={Consultations}
			subscription="book.consultations"
			selector={books.selector(name)}
			sort={{datetime: 1}}
			List={PagedConsultationsList}
			listProps={{
				itemProps: {
					showPrice: true,
				} ,
			}}
		/>
	) ;

}

BookDetails.defaultProps = {
	page: 1,
	perpage: 100,
} ;

BookDetails.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;
