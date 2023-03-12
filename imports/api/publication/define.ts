import assert from 'assert';
import {Meteor} from 'meteor/meteor';

import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';

import authorized from '../authorized';
import type Args from '../Args';
import type Params from './Params';
import type Publication from './Publication';
import Authentication from '../Authentication';

// TODO early branch out
const exactlyOne = (array: any[]) =>
	sum(map((x: any) => (x ? 1 : 0), array)) === 1;

const define = <A extends Args, T, U = T, Auth extends Authentication = Authentication>({
	name,
	authentication,
	...rest
}: Params<A, T, U, Auth>): Publication<A> => {
	if (Meteor.isServer) {
		// @ts-expect-error Ignore this for now.
		const fns = [rest.cursor, rest.cursors, rest.handle];
		assert(exactlyOne(fns));
		for (const fn of fns) {
			if (fn) {
				Meteor.publish(name, function (...args) {
					if (!authorized(authentication, this)) {
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
