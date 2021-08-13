import {filterNotInRareBooks} from '../../api/consultations';
import useLastConsultationOfThisYear from './useLastConsultationOfThisYear';

export default function useBookPrefill() {
	const {loading, consultation} = useLastConsultationOfThisYear(
		filterNotInRareBooks(),
	);

	const bookNumber = consultation ? consultation.book : '1';
	// // The code below will add + 1 when a book exceeds capacity
	// const name = books.name( consultation.datetime , consultation.book ) ;
	// const selector = books.selector( name ) ;
	// const count = Consultations.find( selector ).count();
	// if ( count >= books.MAX_CONSULTATIONS ) bookPrefill = ''+((+bookPrefill)+1) ;

	return {loading, bookNumber};
}
