import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import {Patients} from '../../collection/patients';
import {countCollection, type PollResult} from '../../collection/stats';
import type Selector from '../../Selector';
import type Filter from '../../transaction/Filter';
import define from '../define';

export const frequencySexKey = (query) =>
	`frequencySex-${JSON.stringify(query ?? {})}`;
export const frequencySexPublication = `${countCollection}.frequencySex`;

export type GenderCount = {
	other?: number;
	female?: number;
	male?: number;
	''?: number;
	undefined?: number;
};

export default define({
	name: frequencySexPublication,
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema
			.object({
				/* TODO */
			})
			.nullable(),
	]),
	handle(filter: Filter<ConsultationDocument> | null) {
		const collection = countCollection;
		const key = frequencySexKey(filter);
		const selector = {
			...filter,
			isDone: true,
			owner: this.userId,
		} as Selector<ConsultationDocument>;
		const options = {
			fields: {
				patientId: 1,
			},
		};
		let total = 0;
		const refs = new Map<string, string>();
		const pRefs = new Map<string, {freq: number; sex: string | undefined}>();
		const count: [GenderCount, ...GenderCount[]] = [{}];

		const state = (): PollResult<GenderCount[]> => ({
			total,
			count,
		});

		const inc = (patientId: string | undefined) => {
			if (patientId === undefined || !pRefs.has(patientId))
				throw new Error(`inc: patientId ${patientId} does not exist`);
			const patient = pRefs.get(patientId)!;
			count[patient.freq]![patient.sex ?? 'undefined'] -= 1;
			patient.freq += 1;
			if (count[patient.freq] === undefined) count[patient.freq] = {};
			if (count[patient.freq]![patient.sex ?? 'undefined'] === undefined)
				count[patient.freq]![patient.sex ?? 'undefined'] = 0;
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			count[patient.freq]![patient.sex ?? 'undefined'] += 1;
		};

		const dec = (patientId: string | undefined) => {
			if (patientId === undefined || !pRefs.has(patientId))
				throw new Error(`dec: patientId ${patientId} does not exist`);
			const patient = pRefs.get(patientId)!;
			count[patient.freq]![patient.sex ?? 'undefined'] -= 1;
			patient.freq -= 1;
			if (count[patient.freq] === undefined) count[patient.freq] = {};
			if (count[patient.freq]![patient.sex ?? 'undefined'] === undefined)
				count[patient.freq]![patient.sex ?? 'undefined'] = 0;
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			count[patient.freq]![patient.sex ?? 'undefined'] += 1;
		};

		let initializing = true;
		const commit = () => {
			if (!initializing) {
				this.changed(collection, key, state());
			}
		};

		const pHandle = Patients.find(
			{owner: this.userId},
			{fields: {sex: 1}},
		).observeChanges({
			added(_id, {sex}) {
				const sexKey = `${sex}`;
				pRefs.set(_id, {freq: 0, sex: sexKey});
				if (count[0][sexKey] === undefined) count[0][sexKey] = 0;
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				count[0][sexKey] += 1;
				commit();
			},
			changed(_id, {sex}) {
				const {freq, sex: prev} = pRefs.get(_id)!;
				const prevKey = `${prev}`;
				count[freq]![prevKey] -= 1;
				const sexKey = `${sex}`;
				if (count[freq]![sexKey] === undefined) count[freq]![sexKey] = 0;
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				count[freq]![sexKey] += 1;
				pRefs.set(_id, {freq, sex: sexKey});
				commit();
			},
			removed(_id) {
				pRefs.delete(_id);
				// everything should be commited by the consultations observer
			},
		});

		const cHandle = Consultations.find(selector, options).observeChanges({
			added(_id, {patientId}) {
				if (patientId === undefined)
					throw new Error(
						`added: consultation ${_id} is not linked to a patient.`,
					);
				total += 1;
				inc(patientId);
				refs.set(_id, patientId);
				commit();
			},

			// changed: ... // TODO We assume a consultation does not change
			// patientId. Handle that.

			removed(_id) {
				total -= 1;
				const patientId = refs.get(_id)!;
				dec(patientId);
				refs.delete(_id);
				commit();
			},
		});

		initializing = false;
		this.added(collection, key, state());
		this.ready();

		this.onStop(() => {
			cHandle.stop();
			pHandle.stop();
		});
	},
});
