import {setDone as setMigrationsStatusDone} from './status';

import v1 from './versions/v1';
import v2 from './versions/v2';
import v3 from './versions/v3';

const scheduleAll = async () => {
	console.time('migrations');
	await v1();
	await v2();
	await v3();
	console.timeEnd('migrations');

	setMigrationsStatusDone();
};

export default scheduleAll;
