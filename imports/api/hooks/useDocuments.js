import makeQuery from '../makeQuery';
import {Documents} from '../documents';

const useDocuments = makeQuery(Documents, 'documents');
export default useDocuments;
