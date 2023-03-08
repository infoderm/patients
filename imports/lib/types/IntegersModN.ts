// See https://stackoverflow.com/q/39494689

type IntegersModN<
	N extends number,
	Accumulator extends number[] = [],
> = Accumulator['length'] extends N
	? Accumulator[number]
	: IntegersModN<N, [...Accumulator, Accumulator['length']]>;

export default IntegersModN;
