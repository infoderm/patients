import makeQuery from '../../api/makeQuery';
import publication from '../../api/publication/books/find';
import {Books} from '../../api/collection/books';

const useBooks = makeQuery(Books, publication);

export default useBooks;
