import {chain} from '@iterable-iterator/chain';
import {filter} from '@iterable-iterator/filter';
import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import {assert} from 'chai';

import {randomUserId, server} from '../../_test/fixtures';
import {newPatient} from '../_dev/populate/patients';
import {Patients} from '../collection/patients';

import type Document from '../Document';
import {newConsultation} from '../_dev/populate/consultations';
import {Consultations} from '../collection/consultations';
import {Appointments} from '../collection/appointments';
import {Attachments} from '../collection/attachments';

import publishCursors from './publishCursors';
import {type Context} from './Context';

type ReadyCall = ['ready'];
type StopCall = ['stop'];
type OnStopCall = ['onStop', () => Promise<void> | void];
type UnblockCall = ['unblock'];
type ErrorCall = ['error', Error];
type AddedCall = ['added', string, string, Document];
type ChangedCall = ['changed', string, string, Document];
type RemovedCall = ['removed', string, string];

type Call =
	| ReadyCall
	| StopCall
	| OnStopCall
	| UnblockCall
	| ErrorCall
	| AddedCall
	| ChangedCall
	| RemovedCall;

type ContextState = {
	calls: {
		push: (call: Call) => void;
		all: () => Call[];
		ready: () => ReadyCall[];
		stop: () => StopCall[];
		onStop: () => OnStopCall[];
		unblock: () => UnblockCall[];
		error: () => ErrorCall[];
		added: () => AddedCall[];
		changed: () => ChangedCall[];
		removed: () => RemovedCall[];
	};
};

const makeMockedContextState = (): ContextState => {
	const _calls: Call[] = [];
	return {
		calls: {
			all: () => list(_calls),
			ready: () => list(filter(([method]) => method === 'ready', _calls)),
			stop: () => list(filter(([method]) => method === 'stop', _calls)),
			onStop: () => list(filter(([method]) => method === 'onStop', _calls)),
			unblock: () => list(filter(([method]) => method === 'unblock', _calls)),
			error: () => list(filter(([method]) => method === 'error', _calls)),
			added: () => list(filter(([method]) => method === 'added', _calls)),
			changed: () => list(filter(([method]) => method === 'changed', _calls)),
			removed: () => list(filter(([method]) => method === 'removed', _calls)),
			push(call: Call) {
				_calls.push(call);
			},
		},
	};
};

const makeMockedContext = (
	state: ContextState,
	userId: string | null,
): Context => {
	return {
		connection: {
			id: '',
			clientAddress: '',
			httpHeaders: {},
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			close() {},
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onClose() {},
		},
		userId,
		error(error: Error) {
			state.calls.push(['error', error]);
		},
		ready() {
			state.calls.push(['ready']);
		},
		stop() {
			state.calls.push(['stop']);
		},
		onStop(callback: () => Promise<void> | void) {
			state.calls.push(['onStop', callback]);
		},
		unblock() {
			state.calls.push(['unblock']);
		},
		added(collection: string, id: string, fields: Document) {
			// TODO: Cover async callbacks.
			state.calls.push(['added', collection, id, fields]);
		},
		changed(collection: string, id: string, fields: Document) {
			state.calls.push(['changed', collection, id, fields]);
		},
		removed(collection: string, id: string) {
			state.calls.push(['removed', collection, id]);
		},
	};
};

server(__filename, () => {
	it('should handle one cursor', async () => {
		const userId = randomUserId();
		await newPatient({userId});
		await newPatient({userId});
		await newPatient({userId});
		const filter = {};
		const cursor = Patients.find(filter);
		const patients = await Patients.find(filter).fetchAsync();

		const state = makeMockedContextState();
		const context = makeMockedContext(state, userId);
		await publishCursors(context, [cursor]);

		const {calls} = state;
		assert.lengthOf(calls.onStop(), 1);
		assert.lengthOf(calls.ready(), 1);

		assert.deepEqual(calls.error(), []);
		assert.deepEqual(calls.stop(), []);

		assert.deepEqual(calls.unblock(), []);

		assert.deepEqual(calls.removed(), []);
		assert.deepEqual(calls.changed(), []);
		assert.sameDeepMembers(
			calls.added(),
			list(
				chain(
					map(({_id, ...rest}) => ['added', 'patients', _id, rest], patients),
				),
			),
		);
	});

	it('should handle two cursors', async () => {
		const userId = randomUserId();

		const patientId = await newPatient({userId});
		await newPatient({userId});
		await newPatient({userId});
		const filter = {};

		const patientsCursor = Patients.find(filter);
		const patients = await Patients.find(filter).fetchAsync();

		await newConsultation({userId}, {patientId});
		await newConsultation({userId}, {patientId});

		const consultationsCursor = Consultations.find(filter);
		const consultations = await Consultations.find(filter).fetchAsync();

		const state = makeMockedContextState();
		const context = makeMockedContext(state, userId);
		await publishCursors<any>(context, [patientsCursor, consultationsCursor]);

		const {calls} = state;
		assert.lengthOf(calls.onStop(), 2);
		assert.lengthOf(calls.ready(), 1);

		assert.deepEqual(calls.error(), []);
		assert.deepEqual(calls.stop(), []);

		assert.deepEqual(calls.unblock(), []);

		assert.deepEqual(calls.removed(), []);
		assert.deepEqual(calls.changed(), []);
		assert.sameDeepMembers(
			calls.added(),
			list(
				chain(
					map(({_id, ...rest}) => ['added', 'patients', _id, rest], patients),
					map(
						({_id, ...rest}) => ['added', 'consultations', _id, rest],
						consultations,
					),
				),
			),
		);
	});

	it('should error if cursors cannot be merged', async () => {
		const filter = {};
		const a = Consultations.find(filter);
		const b = Appointments.find(filter);

		const state = makeMockedContextState();
		const context = makeMockedContext(state, null);
		await publishCursors<any>(context, [a, b]);

		const {calls} = state;
		assert.lengthOf(calls.error(), 1);

		assert.deepEqual(calls.onStop(), []);
		assert.deepEqual(calls.ready(), []);

		assert.deepEqual(calls.stop(), []);

		assert.deepEqual(calls.unblock(), []);

		assert.deepEqual(calls.removed(), []);
		assert.deepEqual(calls.changed(), []);
		assert.deepEqual(calls.added(), []);
	});

	it('should not error if cursors can be merged', async () => {
		const filter = {};
		const a = Patients.find(filter);
		const b = Appointments.find(filter);
		const c = Attachments.find(filter);

		const state = makeMockedContextState();
		const context = makeMockedContext(state, null);
		await publishCursors<any>(context, [a, b, c]);

		const {calls} = state;
		assert.lengthOf(calls.onStop(), 3);
		assert.lengthOf(calls.ready(), 1);

		assert.deepEqual(calls.error(), []);
		assert.deepEqual(calls.stop(), []);

		assert.deepEqual(calls.unblock(), []);

		assert.deepEqual(calls.removed(), []);
		assert.deepEqual(calls.changed(), []);
		assert.deepEqual(calls.added(), []);
	});
});
