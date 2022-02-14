import {useMemo} from 'react';

import {
	// makeAnyIndex,
	makeRegExpIndex,
} from '../../api/string';

import {useSetting} from './hooks';

const useImportantStringsDict = () => {
	const {value: importantStrings} = useSetting('important-strings');

	return useMemo(
		() =>
			// makeAnyIndex(importantStrings);
			makeRegExpIndex(importantStrings),
		[importantStrings],
	);
};

export default useImportantStringsDict;
