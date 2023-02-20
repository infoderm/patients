import {type Mongo} from 'meteor/mongo';
import {Tracker} from 'meteor/tracker';

type Events = {
	added?: boolean;
	addedBefore?: boolean;
	changed?: boolean;
	movedBefore?: boolean;
	removed?: boolean;
};

const makeReactive = <T, U = T>(
	cursor: Mongo.Cursor<T, U>,
	events: Events,
	_allow_unordered = false,
): boolean => {
	// NOTE Adapted from
	// https://github.com/meteor/meteor/blob/9b6c797f09e4a16068541667cdde5b3eabfc5c95/packages/minimongo/cursor.js#L358-L377
	if (!Tracker.active) return false;

	const dependency = new Tracker.Dependency();
	const notify = dependency.changed.bind(dependency);

	dependency.depend();

	const options = {_allow_unordered, _suppress_initial: true};

	const handlers = Object.fromEntries(
		['added', 'addedBefore', 'changed', 'movedBefore', 'removed']
			.filter((fn) => events[fn])
			.map((fn) => [fn, notify]),
	);

	// observeChanges will stop() when this computation is invalidated
	// @ts-expect-error Types are wrong.
	cursor.observeChanges({...handlers, ...options});
	return true;
};

export default makeReactive;
