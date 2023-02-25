import {useMemo} from 'react';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {units as durationUnits} from '../../api/duration';
import {mod} from '../../lib/arithmetic';
import {useWeekStartsOn} from '../../i18n/datetime';

export const weekSlotsCyclicOrder = (weekStartsOn: number) =>
	key(increasing, ({beginModuloWeek}: {beginModuloWeek: number}) =>
		mod(beginModuloWeek - weekStartsOn * durationUnits.day, durationUnits.week),
	);

const useWorkScheduleSort = () => {
	const weekStartsOn = useWeekStartsOn();

	const compare = useMemo(
		() => weekSlotsCyclicOrder(weekStartsOn),
		[weekStartsOn],
	);

	const sort = useMemo(
		() => (items: any[]) => items.slice().sort(compare),
		[compare],
	);

	return sort;
};

export default useWorkScheduleSort;
