export const AuthenticationDangerousNone = 'DANGEROUS-NONE';
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuthenticationDangerousNone = typeof AuthenticationDangerousNone;

export const AuthenticationLoggedIn = 'logged-in';
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuthenticationLoggedIn = typeof AuthenticationLoggedIn;

export type Authentication =
	| AuthenticationDangerousNone
	| AuthenticationLoggedIn;
