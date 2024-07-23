import {setDone as setMigrationsStatusDone} from './status';

import v1 from './versions/v1';

const scheduleAll = async () => {
	console.time('migrations');
	await v1();
	console.timeEnd('migrations');

	setMigrationsStatusDone();
};

export default scheduleAll;
