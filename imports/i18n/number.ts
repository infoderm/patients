import {useMemo} from 'react';

import useLocales from './useLocales';

type NumberFormatPart =
	| {type: 'currency'; value: string}
	| {type: 'literal'; value: string}
	| {type: 'integer'; value: string}
	| {type: 'group'; value: string}
	| {type: 'decimal'; value: string}
	| {type: 'fraction'; value: string};

const poormansNumberFormat = (options?: Intl.NumberFormatOptions) => ({
	format: (value: number | bigint): string => value.toString(),
	formatToParts(value: number | bigint) {
		const [units, fraction] = value.toString().split('.');
		const parts: NumberFormatPart[] = [];

		if (options?.style === 'currency') {
			parts.push(
				{
					type: 'currency',
					value: options.currency!,
				},
				{
					type: 'literal',
					value: ' ',
				},
			);
		}

		if (units !== undefined && units !== '') {
			const tail: string[] = [];
			let i = units.length;
			for (; i >= 3; i -= 3) {
				tail.push(units.slice(i - 3, i));
			}

			parts.push({
				type: 'integer',
				value: units.slice(0, i),
			});
			for (const group of tail.reverse()) {
				parts.push(
					{
						type: 'group',
						value: ',',
					},
					{
						type: 'integer',
						value: group,
					},
				);
			}
		}

		if (fraction !== undefined && fraction !== '') {
			parts.push(
				{
					type: 'decimal',
					value: '.',
				},
				{
					type: 'fraction',
					value: fraction,
				},
			);
		}

		return parts;
	},
	resolvedOptions: () => ({maximumFractionDigits: 3}),
});

export const useNumberFormat = (options?: Intl.NumberFormatOptions) => {
	const locales = useLocales();
	return useMemo(() => {
		try {
			return new Intl.NumberFormat(locales, options);
		} catch (error: unknown) {
			if (error instanceof TypeError) {
				return poormansNumberFormat(options);
			}

			throw error;
		}
	}, [JSON.stringify(options), locales]);
};
