import {useMemo} from 'react';

import format from 'date-fns/format';
import endOfToday from 'date-fns/endOfToday';
import parseISO from 'date-fns/parseISO';
import subYears from 'date-fns/subYears';

const useBirthdatePickerProps = () => {
	const maxDateString = format(endOfToday(), 'yyyy-MM-dd');

	return useMemo(() => {
		const maxDate = parseISO(maxDateString);
		const minDate = subYears(maxDate, 200);
		return {minDate, maxDate};
	}, [maxDateString]);
};

export default useBirthdatePickerProps;
