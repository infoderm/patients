import {type DocumentId, Documents} from '../../api/collection/documents';

import useSubscription from '../../api/publication/useSubscription';
import useItem from '../../api/publication/useItem';
import findOne from '../../api/publication/documents/findOne';

const useDocument = (documentId: DocumentId) => {
	const isLoading = useSubscription(findOne, [documentId]);
	const loadingSubscription = isLoading();

	const {loading: loadingResult, result} = useItem(
		Documents,
		{_id: documentId},
		undefined,
		[documentId],
	);

	return {
		loading: loadingSubscription || loadingResult,
		result,
	};
};

export default useDocument;
