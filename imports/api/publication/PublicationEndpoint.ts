import type Args from '../Args';

type PublicationEndpoint<_ extends Args> = {
	readonly name: string;
};

export default PublicationEndpoint;
