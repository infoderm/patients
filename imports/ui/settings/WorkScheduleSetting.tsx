import React, {useCallback} from 'react';

import {map} from '@iterable-iterator/map';
import {sorted} from '@iterable-iterator/sorted';

import simplifyUnion from '../../lib/interval/simplifyUnion';
import InputManySetting from './InputManySetting';
import useWorkScheduleSort, {weekSlotsCyclicOrder} from './useWorkScheduleSort';
import ModuloWeekInterval from './ModuloWeekInterval';
import useTimeSlotToString from './useTimeSlotToString';
import timeSlotFromString from './timeSlotFromString';

const KEY = 'work-schedule';

const slotToInterval = ({
	beginModuloWeek,
	endModuloWeek,
}: ModuloWeekInterval): [number, number] => [beginModuloWeek, endModuloWeek];
const intervalToSlot = ([beginModuloWeek, endModuloWeek]: [
	number,
	number,
]): ModuloWeekInterval => ({
	beginModuloWeek,
	endModuloWeek,
});

const slotOrder = weekSlotsCyclicOrder(0);

const itemToKey = (item) => `${item.beginModuloWeek}-${item.endModuloWeek}`;

const useSortAndMerge = () => {
	const sort = useWorkScheduleSort();
	return useCallback(
		(values) =>
			sort(
				Array.from(
					map(
						intervalToSlot,
						simplifyUnion(map(slotToInterval, sorted(slotOrder, values))),
					),
				),
			),
		[sort],
	);
};

const WorkScheduleSetting = ({className}) => {
	const sortAndMerge = useSortAndMerge();
	const itemToString = useTimeSlotToString();

	return (
		<InputManySetting
			className={className}
			title="Work schedule"
			label="Time intervals"
			setting={KEY}
			itemToKey={itemToKey}
			itemToString={itemToString}
			createNewItem={timeSlotFromString}
			placeholder="Give additional time slots"
			sort={sortAndMerge}
		/>
	);
};

export default WorkScheduleSetting;
