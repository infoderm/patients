import faker from 'faker';

import {Uploads} from './uploads';

const randomDimension = () => faker.datatype.number({min: 32, max: 128});

Factory.define('upload', Uploads.collection, {
	file: () =>
		faker.image.dataUri(
			randomDimension(),
			randomDimension() /* Random color ? */,
		),
	fileName: () => faker.system.fileName(),
	isBase64: true,
});

export {Uploads} from './uploads';
