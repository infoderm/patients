export const localeDescriptions: Readonly<Record<string, string>> = {
	'en-US': 'English (US)',
	'fr-BE': 'Français (Belgique)',
	'nl-BE': 'Nederlands (Belgïe)',
};

export default new Set(Object.keys(localeDescriptions));
