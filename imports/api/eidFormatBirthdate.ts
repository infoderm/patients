import parseISO from 'date-fns/parseISO';
import isValid from 'date-fns/isValid';

export default function eidFormatBirthdate(
	string: string,
	fmt: (date: Date) => string
): string {
	const date = parseISO(string);
	return isValid(date) ? fmt(date) : string;
}
