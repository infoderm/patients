import makeQuery from '../../api/makeQuery';
import {Documents} from '../../api/documents';

const useDocuments = makeQuery(Documents, 'documents');
export default useDocuments;
