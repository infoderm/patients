import type Args from '../Args';

type Publication<_ extends Args> = {
	readonly name: string;
};

export default Publication;
