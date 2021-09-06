import makeQuery from '../../api/makeQuery';
import {Documents} from '../../api/collection/documents';
import publication from '../../api/publication/documents/find';

const useDocuments = makeQuery(Documents, publication);
export default useDocuments;
