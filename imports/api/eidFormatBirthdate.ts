import format from 'date-fns/format';

export default function eidFormatBirthdate(date: Date): string {
	return format(date, 'yyyy-MM-dd');
}
