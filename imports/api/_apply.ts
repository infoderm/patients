import {Meteor} from 'meteor/meteor';
import promisify from '../util/promisify';
import type Options from './endpoint/Options';

const __meteor_apply = promisify<unknown>(Meteor.apply.bind(Meteor));

const _apply = async <R>(
	name: string,
	args: any[],
	options: Options<R>,
): Promise<R> => {
	return __meteor_apply(name, args, options) as Promise<R>;
};

export default _apply;
