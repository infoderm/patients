export const AuthenticationDangerousNone = 'DANGEROUS-NONE';
export type AuthenticationDangerousNone = typeof AuthenticationDangerousNone;

export const AuthenticationLoggedIn = 'logged-in';
export type AuthenticationLoggedIn = typeof AuthenticationLoggedIn;

export type Authentication =
	| AuthenticationDangerousNone
	| AuthenticationLoggedIn;

export default Authentication;
