import {units as durationUnits} from '../../api/duration';

const timeSlotFromString = (x) => {
	const parts = x.split(' ');
	if (parts.length !== 4) return undefined;
	const [beginDay, beginModuloDay, endDay, endModuloDay] = parts;
	const a = Number.parseInt(beginDay, 10) * durationUnits.day;
	const b = Number.parseFloat(beginModuloDay) * durationUnits.hour;
	const c = Number.parseInt(endDay, 10) * durationUnits.day;
	const d = Number.parseFloat(endModuloDay) * durationUnits.hour;
	if (!Number.isFinite(a)) return undefined;
	if (!Number.isFinite(b)) return undefined;
	if (!Number.isFinite(c)) return undefined;
	if (!Number.isFinite(d)) return undefined;
	return {
		beginModuloWeek: a + b,
		endModuloWeek:
			c < a || (c <= a && d < b) ? c + d + durationUnits.week : c + d,
	};
};

export default timeSlotFromString;
