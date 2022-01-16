import db from '../backend/mongodb/db';

const reset = async () => {
	const collections = await db().collections();
	return Promise.all(
		collections.map(async (collection) => collection.remove({})),
	);
};

export default reset;
