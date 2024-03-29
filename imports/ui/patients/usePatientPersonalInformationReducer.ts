import {useReducer} from 'react';

import {type PatientDocument} from '../../api/collection/patients';

type State = {
	patient: PatientDocument;
	editing: boolean;
	dirty: boolean;
	deleting: boolean;
};

const initialState = (patient: PatientDocument): State => ({
	patient,
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
	| {type: 'init'; payload: any};

export const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'update': {
			switch (action.key) {
				case 'deathdateModifiedAt': {
					return {
						...state,
						patient: {
							...state.patient,
							[action.key]: action.value,
							deathdate: null,
						},
						dirty: true,
					};
				}

				default: {
					return {
						...state,
						patient: {...state.patient, [action.key]: action.value},
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

		case 'init': {
			return {
				...state,
				editing: false,
				dirty: false,
				deleting: false,
				patient: action.payload,
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
