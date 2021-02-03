import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import startOfToday from 'date-fns/startOfToday';
import intervalToDuration from 'date-fns/intervalToDuration';

import eidParseBirthdate from './eidParseBirthdate.js';
import {Patients} from './patients.js';
import {Consultations} from './consultations.js';

export const countCollection = 'stats.count';
export const Count = new Mongo.Collection(countCollection);

export const countPublicationName = (QueriedCollection, {values}) =>
	`${countCollection}.${QueriedCollection._name}-${values.join('/')}`;

export const countPublicationKey = (QueriedCollection, {values}, query) =>
	`${QueriedCollection._name}-${values.join('/')}-${JSON.stringify(
		query ?? {}
	)}`;

export const getCountOptions = (options) =>
	typeof options === 'string'
		? getCountOptions({fields: [options]})
		: {
				discretize: (x) => options.fields.map((key) => [key, x[key]]),
				values: [...options.fields],
				...options
		  };

const countPublication = (QueriedCollection, {fields, discretize, values}) =>
	function (query) {
		const collection = countCollection;
		const key = countPublicationKey(QueriedCollection, {values}, query);
		const selector = {...query, owner: this.userId};
		const options = {
			fields: Object.fromEntries(fields.map((field) => [field, 1]))
		};

		let total = 0;
		const count = {};

		const state = () => ({
			total,
			count
		});

		const refs = new Map();

		const inc = (object) => {
			let current = count;
			for (const [key, value] of discretize(object)) {
				if (key === values[values.length - 1]) {
					if (value in current) current[value] += 1;
					else current[value] = 1;
				} else {
					if (!(value in current)) current[value] = {};
					current = current[value];
				}
			}
		};

		const dec = (object) => {
			let current = count;
			for (const [key, value] of discretize(object)) {
				if (key === values[values.length - 1]) {
					current[value] -= 1;
				} else {
					current = current[value];
				}
			}
		};

		let initializing = true;
		const handle = QueriedCollection.find(selector, options).observeChanges({
			added: (_id, object) => {
				total += 1;
				inc(object);
				refs.set(_id, {...object});
				if (!initializing) {
					this.changed(collection, key, state());
				}
			},

			changed: (_id, changes) => {
				const previousObject = refs.get(_id);
				dec(previousObject);
				const newObject = {...previousObject, ...changes};
				inc(newObject);
				refs.set(_id, newObject);
				this.changed(collection, key, state());
			},

			removed: (_id) => {
				total -= 1;
				const previousObject = refs.get(_id);
				dec(previousObject);
				refs.delete(_id);
				this.changed(collection, key, state());
			}
		});

		// Instead, we'll send one `added` message right after `observeChanges` has
		// returned, and mark the subscription as ready.
		initializing = false;
		this.added(collection, key, state());
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => handle.stop());
	};

const publishCount = (QueriedCollection, options) => {
	options = getCountOptions(options);
	Meteor.publish(
		countPublicationName(QueriedCollection, options),
		countPublication(QueriedCollection, options)
	);
};

export const frequencySexKey = (query) =>
	`frequencySex-${JSON.stringify(query ?? {})}`;
export const frequencySexPublication = `${countCollection}.frequencySex`;

if (Meteor.isServer) {
	publishCount(Patients, 'sex');
	publishCount(Patients, {
		fields: ['birthdate', 'sex'],
		discretize: ({birthdate, sex}) => {
			if (!birthdate)
				return [
					['key', 'unk'],
					['sex', sex || 'none']
				];
			const _birthdate = eidParseBirthdate(birthdate);
			const thisMorning = startOfToday();
			const ageInterval = {start: _birthdate, end: thisMorning};
			const ageInYears = intervalToDuration(ageInterval).years;
			const incrementYears = 10;
			const decade = Math.trunc(ageInYears / incrementYears);
			const fr = decade * incrementYears;
			const to = fr + incrementYears;
			return [
				['key', `${fr} à ${to}`],
				['sex', sex || 'none']
			];
		},
		values: ['key', 'sex']
	});

	Meteor.publish(frequencySexPublication, function (query) {
		const collection = countCollection;
		const key = frequencySexKey(query);
		const selector = {...query, isDone: true, owner: this.userId};
		const options = {
			fields: {
				patientId: 1
			}
		};
		let total = 0;
		const refs = new Map();
		const pRefs = new Map();
		const count = [{}];

		const state = () => ({
			total,
			count
		});

		const inc = (patientId) => {
			if (!pRefs.has(patientId)) {
				const entry = {
					...Patients.findOne(patientId, {fields: {sex: 1}}), // TODO make reactive
					count: 0
				};
				pRefs.set(patientId, entry);
				if (count[0][entry.sex] === undefined) count[0][entry.sex] = 0;
				count[0][entry.sex] += 1;
			}

			const patient = pRefs.get(patientId);
			count[patient.count][patient.sex] -= 1;
			patient.count += 1;
			if (count[patient.count] === undefined) count[patient.count] = {};
			if (count[patient.count][patient.sex] === undefined)
				count[patient.count][patient.sex] = 0;
			count[patient.count][patient.sex] += 1;
		};

		const dec = (patientId) => {
			const patient = pRefs.get(patientId);
			count[patient.count][patient.sex] -= 1;
			patient.count -= 1;
			if (count[patient.count] === undefined) count[patient.count] = {};
			if (count[patient.count][patient.sex] === undefined)
				count[patient.count][patient.sex] = 0;
			count[patient.count][patient.sex] += 1;
		};

		let initializing = true;
		const handle = Consultations.find(selector, options).observeChanges({
			added: (_id, {patientId}) => {
				total += 1;
				inc(patientId);
				refs.set(_id, patientId);
				if (!initializing) {
					this.changed(collection, key, state());
				}
			},

			removed: (_id) => {
				total -= 1;
				const patientId = refs.get(_id);
				dec(patientId);
				refs.delete(_id);
				this.changed(collection, key, state());
			}
		});

		initializing = false;
		this.added(collection, key, state());
		this.ready();

		this.onStop(() => handle.stop());
	});
}
