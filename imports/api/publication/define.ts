import assert from 'assert';
import {Meteor} from 'meteor/meteor';

import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';

import authorized from '../authorized';
import type Args from '../Args';
import type Params from './Params';
import type Publication from './Publication';

// TODO early branch out
const exactlyOne = (array: any[]) =>
	sum(map((x: any) => (x ? 1 : 0), array)) === 1;

const define = <A extends Args, T, U = T>({
	name,
	authentication,
	cursor,
	cursors,
	handle,
}: Params<A, T, U>): Publication<A> => {
	if (Meteor.isServer) {
		const fns = [cursor, cursors, handle];
		assert(exactlyOne(fns));
		for (const fn of fns) {
			if (fn) {
				Meteor.publish(name, function (...args) {
					if (!authorized(authentication ?? 'logged-in', this)) {
						this.ready();
						return;
					}

					return Reflect.apply(fn, this, args);
				});
				break;
			}
		}
	}

	return {name};
};

export default define;
