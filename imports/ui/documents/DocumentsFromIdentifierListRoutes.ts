import paged from '../routes/paged';

import DocumentsFromIdentifierList from './DocumentsFromIdentifierList';

const DocumentsFromIdentifierListRoutes = paged(DocumentsFromIdentifierList);

export default DocumentsFromIdentifierListRoutes;
