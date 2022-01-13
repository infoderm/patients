import {useMemo} from 'react';
import useWorkScheduleSort from './useWorkScheduleSort';
import {useSettingCached} from './hooks';

const useSortedWorkSchedule = () => {
	const sort = useWorkScheduleSort();
	const {value} = useSettingCached('work-schedule');
	return useMemo(() => sort(value), [sort, value]);
};

export default useSortedWorkSchedule;
