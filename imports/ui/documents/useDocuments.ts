import makeDebouncedResultsQuery from '../../api/makeDebouncedResultsQuery';
import {Documents} from '../../api/collection/documents';
import publication from '../../api/publication/documents/find';

const useDocuments = makeDebouncedResultsQuery(Documents, publication);
export default useDocuments;
