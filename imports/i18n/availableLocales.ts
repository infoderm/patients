export const localeDescriptions = {
	'en-US': 'English (US)',
	'fr-BE': 'Français (Belgique)',
	'nl-BE': 'Nederlands (Belgïe)',
} as const;

export type AvailableLocale = keyof typeof localeDescriptions;

export default new Set<AvailableLocale>(
	Object.keys(localeDescriptions) as AvailableLocale[],
);
