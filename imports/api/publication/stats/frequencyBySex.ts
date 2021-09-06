import {Consultations} from '../../collection/consultations';
import {Patients} from '../../collection/patients';
import {countCollection, PollResult} from '../../collection/stats';
import define from '../define';

export const frequencySexKey = (query) =>
	`frequencySex-${JSON.stringify(query ?? {})}`;
export const frequencySexPublication = `${countCollection}.frequencySex`;

export default define({
	name: frequencySexPublication,
	handle(query) {
		const collection = countCollection;
		const key = frequencySexKey(query);
		const selector = {...query, isDone: true, owner: this.userId};
		const options = {
			fields: {
				patientId: 1,
			},
		};
		let total = 0;
		const refs = new Map();
		const pRefs = new Map();
		const count = [{}];

		const state = (): PollResult => ({
			total,
			count,
		});

		const inc = (patientId: string) => {
			if (!pRefs.has(patientId))
				throw new Error(`inc: patientId ${patientId} does not exist`);
			const patient = pRefs.get(patientId);
			count[patient.freq][patient.sex] -= 1;
			patient.freq += 1;
			if (count[patient.freq] === undefined) count[patient.freq] = {};
			if (count[patient.freq][patient.sex] === undefined)
				count[patient.freq][patient.sex] = 0;
			count[patient.freq][patient.sex] += 1;
		};

		const dec = (patientId: string) => {
			if (!pRefs.has(patientId))
				throw new Error(`dec: patientId ${patientId} does not exist`);
			const patient = pRefs.get(patientId);
			count[patient.freq][patient.sex] -= 1;
			patient.freq -= 1;
			if (count[patient.freq] === undefined) count[patient.freq] = {};
			if (count[patient.freq][patient.sex] === undefined)
				count[patient.freq][patient.sex] = 0;
			count[patient.freq][patient.sex] += 1;
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
			added: (_id, {sex}) => {
				pRefs.set(_id, {freq: 0, sex});
				if (count[0][sex] === undefined) count[0][sex] = 0;
				count[0][sex] += 1;
				commit();
			},
			changed: (_id, {sex}) => {
				const {freq, sex: prev} = pRefs.get(_id);
				count[freq][prev] -= 1;
				if (count[freq][sex] === undefined) count[freq][sex] = 0;
				count[freq][sex] += 1;
				pRefs.set(_id, {freq, sex});
				commit();
			},
			removed: (_id) => {
				pRefs.delete(_id);
				// everything should be commited by the consultations observer
			},
		});

		const cHandle = Consultations.find(selector, options).observeChanges({
			added: (_id, {patientId}) => {
				total += 1;
				inc(patientId);
				refs.set(_id, patientId);
				commit();
			},

			// changed: ... // TODO We assume a consultation does not change
			// patientId. Handle that.

			removed: (_id) => {
				total -= 1;
				const patientId = refs.get(_id);
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
