import {useCallback, useState} from 'react';

const useDocumentsListAutoFilter = () => {
	const [isFiltered, setIsFiltered] = useState(true);

	const filter = isFiltered ? {deleted: false} : undefined;

	const toggleFilter = useCallback(() => {
		setIsFiltered(!isFiltered);
	}, [isFiltered, setIsFiltered]);

	return [filter, toggleFilter] as const;
};

export default useDocumentsListAutoFilter;
