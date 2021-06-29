const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type UnitsRecord = Record<string, number>;
type UnitsArray = Array<[string, number]>;

export const units: UnitsRecord = {
	day: DAY,
	hour: HOUR,
	minute: MINUTE,
	second: SECOND,
	millisecond: MILLISECOND
};

const DEFAULT_UNITS: UnitsArray = [
	['day', DAY],
	['hour', HOUR],
	['minute', MINUTE],
	['second', SECOND]
];

const DEFAULT_REST_UNIT = 'millisecond';

const DEFAULT_ABBR = {
	day: 'd',
	hour: 'h',
	minute: 'm',
	second: 's',
	millisecond: 'ms'
};

const DEFAULT_KEY_TO_STRING = (key: string, value: number, options) =>
	options.verbose ? options.conjugate(key, value, options) : DEFAULT_ABBR[key];

const DEFAULT_VERBOSE = false;

const DEFAULT_CONJUGATE = (key: string, value: number, _options) =>
	' ' + key + (value > 1 ? 's' : '');

const DEFAULT_SEPARATOR = ' ';

const DEFAULT_OPTIONS = {
	units: DEFAULT_UNITS,
	restUnit: DEFAULT_REST_UNIT,
	keyToString: DEFAULT_KEY_TO_STRING,
	verbose: DEFAULT_VERBOSE,
	conjugate: DEFAULT_CONJUGATE,
	separator: DEFAULT_SEPARATOR
};

function* quantityToDigits(
	units: UnitsArray,
	restUnit: string,
	quantity: number
): IterableIterator<[string, number]> {
	let rest = quantity;

	for (const [key, size] of units) {
		const howManyOfKey = Math.trunc(rest / size);
		if (howManyOfKey > 0) {
			yield [key, howManyOfKey];
			rest -= howManyOfKey * size;
		}
	}

	if (rest === quantity || rest > 0) {
		yield [restUnit, rest];
	}
}

type Options = typeof DEFAULT_OPTIONS;

function* msToParts(ms: number, options: Options) {
	const digits = quantityToDigits(options.units, options.restUnit, ms);
	const keyToString = options.keyToString;

	for (const [key, value] of digits) {
		yield `${value}${keyToString(key, value, options)}`;
	}
}

export const msToString = (dirtyMs: number, dirtyOptions?: Options) => {
	const options = Object.assign({}, DEFAULT_OPTIONS, dirtyOptions);
	const ms = dirtyMs;
	return [...msToParts(ms, options)].join(options.separator);
};

export const msToStringShort = (
	dirtyMs: number,
	dirtyOptions?: Options
): string => {
	const options = Object.assign({}, DEFAULT_OPTIONS, dirtyOptions);
	const ms = dirtyMs;
	return msToParts(ms, options).next().value as string;
};
