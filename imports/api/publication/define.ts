import assert from 'assert';
import {Meteor} from 'meteor/meteor';

import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';

import authorized from '../authorized';
import {type Authentication} from '../Authentication';
import type InferArgs from '../InferArgs';
import type ArgsSchema from '../ArgsSchema';
import type Params from './Params';
import type Publication from './Publication';
import PublicationError from './PublicationError';

// TODO early branch out
const exactlyOne = (array: any[]) =>
	sum(map((x: any) => (x ? 1 : 0), array)) === 1;

const define = <
	S extends ArgsSchema,
	T,
	U = T,
	Auth extends Authentication = Authentication,
	A extends InferArgs<S> = InferArgs<S>,
>({
	name,
	authentication,
	schema,
	...rest
}: Params<S, T, U, Auth>): Publication<A> => {
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

					try {
						schema.parse(args);
					} catch (error: unknown) {
						console.debug({name, error});
						throw new PublicationError(
							'schema validation of publication args failed',
						);
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
