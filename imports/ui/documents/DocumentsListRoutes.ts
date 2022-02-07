import paged from '../routes/paged';

import DocumentsList from './DocumentsList';

const DocumentsListRoutes = paged(DocumentsList);

export default DocumentsListRoutes;
