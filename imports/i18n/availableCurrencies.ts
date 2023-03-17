export const currencyDescriptions = {
	EUR: '€',
} as const;

export type AvailableCurrency = keyof typeof currencyDescriptions;

export default new Set<AvailableCurrency>(
	Object.keys(currencyDescriptions) as AvailableCurrency[],
);
