import {Meteor} from 'meteor/meteor';
import {DDP} from 'meteor/ddp';

import promisify from '../lib/async/promisify';

import {AsyncLock} from '../lib/async/lock';

import type Options from './endpoint/Options';
import type Args from './Args';
import type Serializable from './Serializable';

const _lock = new AsyncLock();

const __meteor_apply_promisified = promisify(
	// @ts-expect-error Private access.
	Meteor.applyAsync.bind(Meteor),
);

const _apply = async <R extends Serializable>(
	name: string,
	args: Args,
	options?: Options<R>,
): Promise<R> => {
	// NOTE Like
	// https://github.com/meteor/meteor/blob/5f77b43f758746b585ff92b6632d45ea0cd082cd/packages/ddp-client/common/livedata_connection.js#L606-L617
	// but allowing to customize options.
	const applyOptions = {
		isFromCallAsync: true,
		...options,
	};
	const handle = await _lock.acquire();
	try {
		// @ts-expect-error Private access.
		DDP._CurrentMethodInvocation._set();
		// @ts-expect-error Private access.
		DDP._CurrentMethodInvocation._setCallAsyncMethodRunning(true);
		const result = await __meteor_apply_promisified(name, args, applyOptions);
		// @ts-expect-error Private access.
		DDP._CurrentMethodInvocation._setCallAsyncMethodRunning(false);
		return result as R;
	} finally {
		_lock.release(handle);
	}
};

export default _apply;
