import type IntegersModN from './types/IntegersModN';

export const mod = <M extends number>(n: number, m: M) =>
	(((n % m) + m) % m) as IntegersModN<M>;
