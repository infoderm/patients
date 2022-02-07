import byBook from '../routes/byBook';
import paged from '../routes/paged';
import BookDetails from './BookDetails';

const BookDetailsRoutes = byBook(paged(BookDetails));

export default BookDetailsRoutes;
