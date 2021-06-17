import faker from 'faker';

import {Uploads} from './uploads.js';

const randomDimension = () => faker.random.number({min: 32, max: 128});

export {Uploads};

Factory.define('upload', Uploads.collection, {
	file: () =>
		faker.image.dataUri(
			randomDimension(),
			randomDimension() /* Random color ? */
		),
	fileName: () => faker.system.fileName(),
	isBase64: true
});
