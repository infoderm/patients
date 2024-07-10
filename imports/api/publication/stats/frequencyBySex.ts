import assert from 'assert';

import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
	consultationDocument,
} from '../../collection/consultations';
import {Patients} from '../../collection/patients';
import {countCollection, type PollResult} from '../../collection/stats';
import define from '../define';
import {userFilter} from '../../query/UserFilter';
import type UserFilter from '../../query/UserFilter';
import observeSetChanges from '../../query/observeSetChanges';
import type Filter from '../../query/Filter';

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

type Consultation = string;
type Patient = {consultations: Set<string>; sex: string; removed: boolean};

export default define({
	name: frequencySexPublication,
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([userFilter(consultationDocument).nullable()]),
	async handle(filter: UserFilter<ConsultationDocument> | null) {
		const collection = countCollection;
		const key = frequencySexKey(filter);
		const selector = {
			...filter,
			isDone: true,
			owner: this.userId,
		} as Filter<ConsultationDocument>;
		const options = {
			fields: {
				patientId: 1,
			},
		};
		let total = 0;
		const cRefs = new Map<string, Consultation>();
		const pRefs = new Map<string, Patient>();
		const count: [GenderCount, ...GenderCount[]] = [{}];

		const state = (): PollResult<GenderCount[]> => ({
			total,
			count,
		});

		const inc = (patient: Patient) => {
			total += 1;
			count[patient.consultations.size]![patient.sex] -= 1;
			const freq = patient.consultations.size + 1;
			if (count[freq] === undefined) count[freq] = {};
			if (count[freq]![patient.sex] === undefined)
				count[freq]![patient.sex] = 0;
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			count[freq]![patient.sex] += 1;
		};

		const dec = (patient: Patient) => {
			total -= 1;
			count[patient.consultations.size]![patient.sex] -= 1;
			const freq = patient.consultations.size - 1;
			if (count[freq] === undefined) count[freq] = {};
			if (count[freq]![patient.sex] === undefined)
				count[freq]![patient.sex] = 0;
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			count[freq]![patient.sex] += 1;
		};

		let initializing = true;
		const commit = () => {
			if (!initializing) {
				this.changed(collection, key, state());
			}
		};

		const _ensurePatient = (patientId: string) => {
			const existing = pRefs.get(patientId);
			if (existing !== undefined) return existing;

			const removed: Patient = {
				consultations: new Set(),
				sex: 'undefined',
				removed: true,
			};
			pRefs.set(patientId, removed);
			return removed;
		};

		const addConsultation = (patientId: string, consultationId: string) => {
			const patient = _ensurePatient(patientId);
			if (!patient.removed) inc(patient);
			patient.consultations.add(consultationId);
			cRefs.set(consultationId, patientId);
		};

		const removeConsultation = (patientId: string, consultationId: string) => {
			const patient = pRefs.get(patientId);
			assert(patient !== undefined);
			if (!patient.removed) dec(patient);
			patient.consultations.delete(consultationId);
			cRefs.delete(consultationId);
		};

		const pHandle = await observeSetChanges(
			Patients,
			{owner: this.userId},
			{fields: {sex: 1}},
			{
				added(_id, {sex}) {
					const sexKey = `${sex}`;
					const previous = pRefs.get(_id);
					assert(previous === undefined || previous.removed);
					const consultations = previous?.consultations ?? new Set();
					pRefs.set(_id, {consultations, sex: sexKey, removed: false});

					if (count[consultations.size]![sexKey] === undefined)
						count[consultations.size]![sexKey] = 0;
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					count[consultations.size]![sexKey] += 1;

					total += consultations.size;
					commit();
				},
				changed(_id, {sex}) {
					const {consultations, sex: prev, removed} = pRefs.get(_id)!;
					assert(!removed);
					const prevKey = `${prev}`;
					const freq = consultations.size;
					count[freq]![prevKey] -= 1;
					const sexKey = `${sex}`;
					if (count[freq]![sexKey] === undefined) count[freq]![sexKey] = 0;
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					count[freq]![sexKey] += 1;
					pRefs.set(_id, {consultations, sex: sexKey, removed: false});
					commit();
				},
				removed(_id) {
					const patient = pRefs.get(_id);
					assert(patient !== undefined);
					assert(!patient.removed);
					const sexKey = patient.sex;
					if (patient.consultations.size === 0) {
						count[0]![sexKey] -= 1;
						pRefs.delete(_id);
					} else {
						pRefs.set(_id, {...patient, removed: true});
						total -= patient.consultations.size;
						count[patient.consultations.size]![patient.sex] -= 1;
					}

					commit();
				},
			},
			{
				projectionFn: ({sex}) => ({sex}),
			},
		);

		const cHandle = await observeSetChanges(
			Consultations,
			selector,
			options,
			{
				added(_id, {patientId}) {
					assert(patientId !== undefined);
					addConsultation(patientId, _id);
					commit();
				},

				// changed: ... // TODO We assume a consultation does not change
				// patientId. Handle that.

				removed(_id) {
					const patientId = cRefs.get(_id);
					assert(patientId !== undefined);
					removeConsultation(patientId, _id);
					commit();
				},
			},
			{projectionFn: ({patientId}) => ({patientId})},
		);

		initializing = false;
		this.added(collection, key, state());
		this.ready();

		this.onStop(async () => {
			await Promise.all([cHandle.emit('stop'), pHandle.emit('stop')]);
		});
	},
});
