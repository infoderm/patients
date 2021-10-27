import {useMemo} from 'react';
import {useSettingCached} from '../../client/settings';
import useWorkScheduleSort from './useWorkScheduleSort';

const useSortedWorkSchedule = () => {
	const sort = useWorkScheduleSort();
	const {value} = useSettingCached('work-schedule');
	return useMemo(() => sort(value), [sort, value]);
};

export default useSortedWorkSchedule;
