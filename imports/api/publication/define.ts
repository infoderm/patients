import assert from 'assert';

import {Meteor} from 'meteor/meteor';

import {filter} from '@iterable-iterator/filter';
import {next} from '@iterable-iterator/next';

import authorized from '../authorized';
import {type Authentication} from '../Authentication';
import type InferArgs from '../InferArgs';
import type ArgsSchema from '../ArgsSchema';

import type Params from './Params';
import type PublicationEndpoint from './PublicationEndpoint';
import type Cursor from './Cursor';
import publishCursors from './publishCursors';

import PublicationError from './PublicationError';
import {type Context} from './Context';

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
}: Params<S, T, U, Auth>): PublicationEndpoint<A> => {
	if (Meteor.isServer) {
		// @ts-expect-error Ignore this for now.
		const {cursor, cursors, handle} = rest;
		const defined = filter(
			(x: unknown) => x !== undefined,
			[cursor, cursors, handle],
		);
		const callback = next(defined);
		assert(next(defined, null) === null);

		const postProcess = _getPostProcess({cursor, cursors, handle}, callback);

		Meteor.publish(name, async function (...args) {
			if (!authorized(authentication, this)) {
				this.ready();
				return;
			}

			const parsedArgs = _parse(name, schema, args);

			const result = await Reflect.apply(callback, this, parsedArgs);
			return postProcess(this, result);
		});
	}

	return {name};
};

const _getPostProcess = <T>(
	{cursor, cursors, handle}: Record<string, T>,
	callback: T,
) => {
	switch (callback) {
		case cursor: {
			return postProcessCursor;
		}

		case cursors: {
			return postProcessCursors;
		}

		default: {
			assert(callback === handle);
			return postProcessHandle;
		}
	}
};

const _parse = <S extends ArgsSchema, A extends InferArgs<S> = InferArgs<S>>(
	name: string,
	schema: S,
	args: unknown[],
): A => {
	try {
		schema.parse(args);
		return args as A; // TODO Use parsed value once it does not reorder object keys.
	} catch (error: unknown) {
		console.debug({
			publication: name,
			args: JSON.stringify(args, undefined, 2),
			error,
		});
		throw new PublicationError('schema validation of publication args failed');
	}
};

const postProcessCursor = async <T extends Document, U = T>(
	context: Context,
	cursor: Cursor<T, U>,
) => publishCursors(context, [cursor]);
const postProcessCursors = async <T extends Document, U = T>(
	context: Context,
	cursors: Array<Cursor<T, U>>,
) => publishCursors(context, cursors);
const postProcessHandle = (_context: Context, result: any) => result;

export default define;
