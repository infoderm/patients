import schema from '../../lib/schema';
import {document} from '../Document';

import define from './define';

const changeDocument = schema.object({
	_id: schema.string(),
	owner: schema.string(),
	when: schema.date(),
	who: schema.object({
		type: schema.literal('user'),
		_id: schema.string(),
	}),
	why: schema.object({
		method: schema.string(),
		source: schema.union([
			schema.object({
				type: schema.literal('manual'),
			}),
			schema.object({
				type: schema.literal('entity'),
				collection: schema.string(),
				_id: schema.string(),
			}),
		]),
	}),
	what: schema.object({
		type: schema.union([schema.literal('patient'), schema.never()]),
		_id: schema.string(),
	}),
	operation: schema.union([
		schema.object({
			type: schema.literal('update'),
			$set: document.optional(),
			$unset: schema.record(schema.string(), schema.boolean()).optional(),
		}),
		schema.object({
			type: schema.literal('create'),
			$set: document.optional(),
		}),
		schema.object({
			type: schema.literal('read'),
		}),
		schema.object({
			type: schema.literal('delete'),
		}),
	]),
});

export type ChangeDocument = schema.infer<typeof changeDocument>;

const collection = 'changes';
export const Changes = define<ChangeDocument>(collection);
