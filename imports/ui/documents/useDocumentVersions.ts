import {Documents} from '../../api/collection/documents';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
import find from '../../api/publication/documents/find';

const useDocumentVersions = (document) => {
	const {parsed, identifier, reference} = document;

	const query = {identifier, reference};
	const options = {
		sort: {status: 1, datetime: -1},
		fields: {identifier: 1, reference: 1, status: 1, datetime: 1},
	};

	const deps = [JSON.stringify(query), JSON.stringify(options)];

	const isLoading = useSubscription(parsed ? find : null, query, options);
	const loading = isLoading();

	const fetchedVersions = useCursor(
		() => (parsed ? Documents.find(query, options) : null),
		deps,
	);

	return parsed
		? {loading, versions: fetchedVersions}
		: {loading: false, versions: [document]};
};

export default useDocumentVersions;
