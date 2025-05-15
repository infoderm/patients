import dateFormat from 'date-fns/format';
import isValid from 'date-fns/isValid';
import { useCallback, useMemo } from 'react';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

const serializeDate = (datetime: Date) => dateFormat(datetime, 'yyyy-MM-dd');
const serializeTime = (datetime: Date) => dateFormat(datetime, 'HH:mm');
const unserializeDate = (date: string) => new Date(date);
const unserializeDatetime = (date: string, time: string) =>
	new Date(`${date}T${time}`);
const unserializeTime = (time: string) =>
	unserializeDatetime('1970-01-01', time);


export type DateTimePickerState = {
	datetime: Date,
	date: Date,
	setDate: (value: Date | undefined | null) => void,
	isValidDate: boolean,
	time: Date | null,
	setTime: (value: Date | undefined | null) => void,
	isValidTime: boolean,
};

export const useDateTimePickerState = (init: Date, initTime: boolean): DateTimePickerState => {
	const [dateString, setDateString] = useStateWithInitOverride<string>(
		serializeDate(init),
	);
	const [isValidDate, setIsValidDate] = useStateWithInitOverride<boolean>(
		isValid(init),
	);
	const [timeString, setTimeString] = useStateWithInitOverride<string>(
		initTime ? serializeTime(init) : '',
	);
	const [isValidTime, setIsValidTime] = useStateWithInitOverride<boolean>(
		initTime && isValid(init),
	);
	const setDate = useCallback((value: Date | undefined | null) => {
		if (isValid(value)) {
			setDateString(serializeDate(value!));
			setIsValidDate(true);
		} else {
			setIsValidDate(false);
		}
	}, [setDateString, setIsValidDate]);

	const setTime = useCallback((value: Date | undefined | null) => {
		if (isValid(value)) {
			setTimeString(serializeTime(value!));
			setIsValidTime(true);
		} else {
			setIsValidTime(false);
		}
	}, [setTimeString, setIsValidTime]);

	const date = useMemo(() => unserializeDate(dateString), [dateString]);
	const time = useMemo(() => timeString === '' ? null : unserializeTime(timeString), [timeString]);
	const datetime = useMemo(() => unserializeDatetime(dateString, timeString), [dateString, timeString]);

	return useMemo(() => ({
		datetime,
		date,
		setDate,
		isValidDate,
		time,
		setTime,
		isValidTime,
	}), [
		datetime,
		date,
		setDate,
		isValidDate,
		time,
		setTime,
		isValidTime,
	]);
}
