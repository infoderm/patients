import assert from 'assert';
import {Meteor} from 'meteor/meteor';

import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';

import Params from './Params';
import Publication from './Publication';

// TODO early branch out
const exactlyOne = (array: any[]) =>
	sum(map((x: any) => (x ? 1 : 0), array)) === 1;

const define = <T, U = T>({
	name,
	cursor,
	cursors,
	handle,
}: Params<T, U>): Publication => {
	if (Meteor.isServer) {
		const fns = [cursor, cursors, handle];
		assert(exactlyOne(fns));
		for (const fn of fns) {
			if (fn) {
				Meteor.publish(name, fn);
				break;
			}
		}
	}

	return {name};
};

export default define;
