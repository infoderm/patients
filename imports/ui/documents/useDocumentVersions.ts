import {Documents} from '../../api/collection/documents';
import useSubscription from '../../api/publication/useSubscription';
import useCursor from '../../api/publication/useCursor';
import find from '../../api/publication/documents/find';

const useDocumentVersions = (document) => {
	const {parsed, identifier, reference} = document;

	const filter = {identifier, reference};

	const sort = {status: 1, datetime: -1} as const;
	const fields = {identifier: 1, reference: 1, status: 1, datetime: 1} as const;
	const options = {fields, sort};

	const deps = [JSON.stringify(filter), JSON.stringify(options)];

	const isLoading = useSubscription(parsed ? find : null, {
		filter,
		projection: fields,
		sort,
	});
	const loading = isLoading();

	const fetchedVersions = useCursor(
		() => (parsed ? Documents.find(filter, options) : null),
		deps,
	);

	return parsed
		? {loading, versions: fetchedVersions}
		: {loading: false, versions: [document]};
};

export default useDocumentVersions;
