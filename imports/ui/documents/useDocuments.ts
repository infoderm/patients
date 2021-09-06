import makeQuery from '../../api/makeQuery';
import {Documents} from '../../api/collection/documents';

const useDocuments = makeQuery(Documents, 'documents');
export default useDocuments;
