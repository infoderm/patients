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
type Patient = {
	consultations: Set<string>;
	sex: keyof GenderCount;
	removed: boolean;
};

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

		const _erase = (freq: number, sex: keyof GenderCount) => {
			const {[sex]: current, ...rest} = count[freq]!;
			assert(current !== undefined);
			count[freq] = current === 1 ? rest : {[sex]: current - 1, ...rest};
		};

		const _record = (freq: number, sex: string) => {
			if (count[freq] === undefined) count[freq] = {};
			if (count[freq]![sex] === undefined) count[freq]![sex] = 0;
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			count[freq]![sex] += 1;
		};

		const inc = (patient: Patient) => {
			total += 1;
			_erase(patient.consultations.size, patient.sex);
			_record(patient.consultations.size + 1, patient.sex);
		};

		const dec = (patient: Patient) => {
			total -= 1;
			_erase(patient.consultations.size, patient.sex);
			_record(patient.consultations.size - 1, patient.sex);
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
					const sexKey: keyof GenderCount = `${sex}`;
					const previous = pRefs.get(_id);
					assert(previous === undefined || previous.removed);
					const consultations = previous?.consultations ?? new Set();
					pRefs.set(_id, {consultations, sex: sexKey, removed: false});

					_record(consultations.size, sexKey);

					total += consultations.size;
					commit();
				},
				changed(_id, {sex}) {
					const {consultations, sex: prevKey, removed} = pRefs.get(_id)!;
					assert(!removed);
					const freq = consultations.size;
					_erase(freq, prevKey);
					const sexKey: keyof GenderCount = `${sex}`;
					_record(freq, sexKey);
					pRefs.set(_id, {consultations, sex: sexKey, removed: false});
					commit();
				},
				removed(_id) {
					const patient = pRefs.get(_id);
					assert(patient !== undefined);
					assert(!patient.removed);
					const sexKey = patient.sex;
					if (patient.consultations.size === 0) {
						_erase(0, sexKey);
						pRefs.delete(_id);
					} else {
						pRefs.set(_id, {...patient, removed: true});
						total -= patient.consultations.size;
						_erase(patient.consultations.size, patient.sex);
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

		this.onStop(async (error?: Error) => {
			await Promise.all([
				cHandle.emit('stop', error),
				pHandle.emit('stop', error),
			]);
		});
	},
});
