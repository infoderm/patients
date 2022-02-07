import paged from '../routes/paged';

import DocumentVersionsList from './DocumentVersionsList';

const DocumentVersionsListRoutes = paged(DocumentVersionsList);

export default DocumentVersionsListRoutes;
