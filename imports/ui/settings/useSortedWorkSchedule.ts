import {useSettingCached} from '../../client/settings';
import useWorkScheduleSort from './useWorkScheduleSort';

const useSortedWorkSchedule = () => {
	const sort = useWorkScheduleSort();
	const {value} = useSettingCached('work-schedule');
	return sort(value);
};

export default useSortedWorkSchedule;
