export const localeDescriptions = {
	'en-US': 'English (US)',
	'fr-BE': 'Français (Belgique)',
	'nl-BE': 'Nederlands (Belgïe)',
} as const;

export default new Set(Object.keys(localeDescriptions));
