import startOfToday from 'date-fns/startOfToday';
import intervalToDuration from 'date-fns/intervalToDuration';
import {publishCount} from '../../stats';
import {Patients} from '../../collection/patients';
import eidParseBirthdate from '../../eidParseBirthdate';

export default publishCount(Patients, {
	fields: ['birthdate', 'sex'],
	discretize: ({birthdate, sex}) => {
		if (!birthdate)
			return [
				['key', 'unk'],
				['sex', sex || 'none'],
			];
		const _birthdate = eidParseBirthdate(birthdate);
		const thisMorning = startOfToday();
		const ageInterval = {start: _birthdate, end: thisMorning};
		const ageInYears = intervalToDuration(ageInterval).years;
		const incrementYears = 10;
		const decade = Math.trunc(ageInYears / incrementYears);
		const fr = decade * incrementYears;
		const to = fr + incrementYears;
		return [
			['key', `${fr} à ${to}`],
			['sex', sex || 'none'],
		];
	},
	values: ['key', 'sex'],
});
