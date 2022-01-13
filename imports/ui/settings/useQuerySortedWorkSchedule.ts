import {useMemo} from 'react';
import {weekSlotsCyclicOrder} from './useWorkScheduleSort';
import {useSettingCached} from './hooks';

const compare = weekSlotsCyclicOrder(0);
const sort = (items: any[]) => items.slice().sort(compare);

const useQuerySortedWorkSchedule = () => {
	const {value} = useSettingCached('work-schedule');
	return useMemo(() => sort(value), [value]);
};

export default useQuerySortedWorkSchedule;
