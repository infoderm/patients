import {useCallback, useState} from 'react';

import isEqual from 'date-fns/isEqual';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

import {useSettingCached} from '../settings/hooks';

const usePlannerNewAppointmentDialogState = () => {
	const [initialDatetime, setInitialDatetime] = useState(new Date());
	const [noInitialTime, setNoInitialTime] = useState(true);
	const [open, setOpen] = useState(false);
	const {value: agendaSlotClickSetsInitialTime} = useSettingCached(
		'agenda-slot-click-sets-initial-time',
	);
	const alwaysNoInitialTime = agendaSlotClickSetsInitialTime === 'off';

	const openOn = useCallback(
		(begin: Date, end: Date) => {
			console.debug({begin, end});
			const noInitialTime =
				isEqual(addDays(begin, 1), end) && isEqual(begin, startOfDay(begin));
			setInitialDatetime(begin);
			setNoInitialTime(alwaysNoInitialTime || noInitialTime);
			setOpen(true);
		},
		[setInitialDatetime, setNoInitialTime, setOpen, alwaysNoInitialTime],
	);

	const onClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	return {
		open,
		onClose,
		initialDatetime,
		noInitialTime,
		openOn,
	};
};

export default usePlannerNewAppointmentDialogState;
