import {useReducer} from 'react';

import {type PatientDocument} from '../../api/collection/patients';
import {documentDiff} from '../../api/update';

type UpdatedPatientDocument = Omit<PatientDocument, 'deathdate'> & {
	deathdate?: Date | null;
};

type State = {
	init: PatientDocument;
	last: PatientDocument;
	current: UpdatedPatientDocument;
	editing: boolean;
	dirty: boolean;
	deleting: boolean;
};

const initialState = (init: PatientDocument): State => ({
	init,
	last: init,
	current: init,
	editing: false,
	dirty: false,
	deleting: false,
});

type Action =
	| {type: 'update'; key: string; value: any}
	| {type: 'editing'}
	| {type: 'not-editing'}
	| {type: 'deleting'}
	| {type: 'not-deleting'}
	| {type: 'undo'}
	| {type: 'merge'; payload: PatientDocument}
	| {type: 'init'; payload: PatientDocument};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'update': {
			if (state[action.key] === action.value) {
				return state;
			}

			switch (action.key) {
				case 'deathdateModifiedAt': {
					const current: UpdatedPatientDocument = {
						...state.current,
						deathdateModifiedAt: action.value,
						deathdate: null,
					};
					const changes = documentDiff(state.init, current);
					const dirty = Object.keys(changes).length > 0;
					return {
						...state,
						current,
						dirty,
					};
				}

				case 'deathdate': {
					const current = {
						...state.current,
						deathdateModifiedAt: new Date(),
						deathdate: action.value,
					};
					const changes = documentDiff(state.init, current);
					const dirty = Object.keys(changes).length > 0;
					return {
						...state,
						current,
						dirty,
					};
				}

				default: {
					const current = {...state.current, [action.key]: action.value};
					const changes = documentDiff(state.init, current);
					const dirty = Object.keys(changes).length > 0;
					return {
						...state,
						current,
						dirty,
					};
				}
			}
		}

		case 'merge': {
			if (state.init === action.payload) {
				return state;
			}

			const {init, current} = state;
			const changes = documentDiff(init, current);
			const dirty = Object.keys(changes).length > 0;

			return dirty
				? {
						...state,
						dirty: true,
						init: action.payload,
						current: {
							...action.payload,
							...changes,
						},
				  }
				: {
						...state,
						dirty: false,
						init: action.payload,
						current: action.payload,
				  };
		}

		case 'editing': {
			return {...state, editing: true};
		}

		case 'not-editing': {
			return {...state, editing: false};
		}

		case 'deleting': {
			return {...state, deleting: true};
		}

		case 'not-deleting': {
			return {...state, deleting: false};
		}

		case 'undo': {
			return {
				...state,
				editing: false,
				init: state.last,
				current: state.last,
			};
		}

		case 'init': {
			return state.last === action.payload
				? state
				: state.editing
				? {
						...state,
						last: action.payload,
				  }
				: {
						...state,
						init: action.payload,
						last: action.payload,
						current: action.payload,
				  };
		}

		default: {
			// @ts-expect-error This should never be called.
			throw new Error(`Unknown action type ${action.type}.`);
		}
	}
};

const usePatientPersonalInformationReducer = (patient: PatientDocument) =>
	useReducer(reducer, initialState(patient));

export default usePatientPersonalInformationReducer;
