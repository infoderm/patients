import {useMemo} from 'react';

import {useNumberFormat} from './number';

export const useCurrencyFormatObject = (currency: string, options?: any) =>
	useNumberFormat({
		style: 'currency',
		currency,
		...options
	});

export const useCurrencyFormat = (currency: string, options?: any) => {
	const numberFormat = useCurrencyFormatObject(currency, options);

	return useMemo(
		() => (value: number | bigint) => numberFormat.format(value),
		[numberFormat]
	);
};

export const useCurrencyOptions = (currency: string, options?: any) => {
	const numberFormat = useCurrencyFormatObject(currency, options);

	return useMemo(() => {
		let groupDelimiter;
		let decimalDelimiter;
		let thousandsGroupStyle;
		let currencyPosition;
		let currencySymbol;
		let currencySpacing;

		const exampleNumber = 123_456.789;
		const parts = numberFormat.formatToParts(exampleNumber);

		for (const {type, value} of parts) {
			switch (type) {
				case 'group':
					groupDelimiter = value;
					break;
				case 'decimal':
					decimalDelimiter = value;
					break;
				case 'integer':
					thousandsGroupStyle =
						value === '1'
							? 'lakh'
							: value === '12'
							? 'wan'
							: value === '123'
							? 'thousand'
							: thousandsGroupStyle;
					break;
				default:
					break;
			}
		}

		if (parts[0].type === 'currency') {
			currencyPosition = 'prefix';
			currencySymbol = parts[0].value;
			if (parts[1].type === 'literal') {
				currencySpacing = parts[1].value;
			}
		} else if (parts[parts.length - 1].type === 'currency') {
			currencyPosition = 'suffix';
			currencySymbol = parts[parts.length - 1].value;
			if (parts[parts.length - 2].type === 'literal') {
				currencySpacing = parts[parts.length - 2].value;
			}
		}

		const {maximumFractionDigits} = numberFormat.resolvedOptions();

		return {
			thousandsGroupStyle,
			currencyPosition,
			currencySymbol,
			currencySpacing,
			groupDelimiter,
			decimalDelimiter,
			maximumFractionDigits
		};
	}, [numberFormat]);
};

export const useReactNumberFormatOptionsForCurrency = (
	currency: string,
	options?: any
) => {
	const currencyOptions = useCurrencyOptions(currency, options);

	return useMemo(() => {
		const {
			thousandsGroupStyle,
			currencyPosition,
			currencySymbol,
			currencySpacing,
			groupDelimiter,
			decimalDelimiter,
			maximumFractionDigits
		} = currencyOptions;

		const suffix =
			currencyPosition === 'suffix'
				? `${currencySpacing ?? ''}${currencySymbol}`
				: '';
		const prefix =
			currencyPosition === 'prefix'
				? `${currencySymbol}${currencySpacing ?? ''}`
				: '';

		const thousandSeparator = groupDelimiter;
		const decimalSeparator = decimalDelimiter;
		const decimalScale = maximumFractionDigits;

		return {
			thousandSeparator,
			decimalSeparator,
			thousandsGroupStyle,
			decimalScale,
			suffix,
			prefix
		};
	}, [currencyOptions]);
};
