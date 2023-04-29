// NOTE These must be ordered from most number of users to least number of
// users. For instance, "en-US" should be placed before the other
// english variants so that that variant is preferred if a user as set their
// browser language to "en" (catch-all for english variants).
// If implementing a catch-all "en" locale, it should be placed before any
// english variants.
export const localeDescriptions = {
	'en-US': 'English (US)',
	'fr-BE': 'Français (Belgique)',
	'nl-BE': 'Nederlands (Belgïe)',
} as const;

export type AvailableLocale = keyof typeof localeDescriptions;

export const availableLocalesOrdered = Object.keys(
	localeDescriptions,
) as AvailableLocale[];

const availableLocales = new Set<AvailableLocale>(availableLocalesOrdered);

export const bestMatch = (locale: string): AvailableLocale | undefined => {
	// TODO If there is no match on the prefix, we do not try to partially
	// match the requested locale. We prefer to fallback to the user resolving
	// the ambiguity manually. We should reevaluate this choice later.
	// TODO Use a trie.
	return availableLocalesOrdered.find((availableLocale) =>
		availableLocale.startsWith(locale),
	);
};

export default availableLocales;
