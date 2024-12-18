import {useReducer} from 'react';

import {type PatientDocument} from '../../api/collection/patients';
import {documentDiff} from '../../api/update';

type State = {
	init: PatientDocument;
	current: Omit<PatientDocument, 'deathdate'> & {deathdate?: Date | null};
	editing: boolean;
	dirty: boolean;
	deleting: boolean;
};

const initialState = (init: PatientDocument): State => ({
	init,
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
					return {
						...state,
						current: {
							...state.current,
							deathdateModifiedAt: action.value,
							deathdate: null,
						},
						dirty: true,
					};
				}

				case 'deathdate': {
					return {
						...state,
						current: {
							...state.current,
							deathdateModifiedAt: new Date(),
							deathdate: action.value,
						},
						dirty: true,
					};
				}

				default: {
					return {
						...state,
						current: {...state.current, [action.key]: action.value},
						dirty: true,
					};
				}
			}
		}

		case 'editing': {
			return {...state, editing: true};
		}

		case 'not-editing': {
			return {...state, editing: false, dirty: false};
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
				dirty: false,
				deleting: false,
				current: state.init,
			};
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

		case 'init': {
			if (state.editing) return state;

			return state.init === action.payload && state.current === action.payload
				? state
				: {
						...state,
						init: action.payload,
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
