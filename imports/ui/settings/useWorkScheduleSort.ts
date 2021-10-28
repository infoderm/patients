import {useMemo} from 'react';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {useSettingCached} from '../../client/settings';
import {units as durationUnits} from '../../api/duration';
import {mod} from '../../util/artithmetic';

export const weekSlotsCyclicOrder = (weekStartsOn: number) =>
	key(increasing, ({beginModuloWeek}: {beginModuloWeek: number}) =>
		mod(beginModuloWeek - weekStartsOn * durationUnits.day, durationUnits.week),
	);

const useWorkScheduleSort = () => {
	const {value: weekStartsOn} = useSettingCached('week-starts-on');

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
