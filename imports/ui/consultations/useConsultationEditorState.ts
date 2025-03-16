import {useEffect, useReducer} from 'react';

import dateParseISO from 'date-fns/parseISO';

import {type PaymentMethod} from '../../api/collection/consultations';
import {type ConsultationDocument} from '../../api/collection/consultations';
import {books} from '../../api/books';
import removeUndefined from '../../util/object/removeUndefined';
import {useSetting} from '../settings/hooks';

export type ConsultationEditorInit = Pick<
	ConsultationDocument,
	| 'isDone'
	| 'patientId'
	| 'datetime'
	| 'doneDatetime'
	| 'reason'
	| 'done'
	| 'todo'
	| 'treatment'
	| 'next'
	| 'more'
	| 'currency'
	| 'payment_method'
	| 'price'
	| 'paid'
	| 'book'
	| 'inBookNumber'
> &
	Partial<Pick<ConsultationDocument, '_id'>>;

const useConsultationEditorState = (consultation: ConsultationEditorInit) => {
	const {loading, value} = useSetting('consultations-paid-sync');
	const [state, dispatch] = useReducer(
		reducer,
		{...consultation, syncPaidPaymentMethods: value},
		init,
	);
	useEffect(() => {
		if (loading) return;
		dispatch({
			type: 'sync-sync-paid-payment-methods',
			syncPaidPaymentMethods: value,
		});
	}, [loading, value]);
	return [state, dispatch] as const;
};

export default useConsultationEditorState;

const isZero = (x: string) => Number.parseInt(x, 10) === 0;
const isValidAmount = (amount: string) => /^\d+$/.test(amount);
const isRealBookNumber = (numberString: string) =>
	books.isRealBookNumberStringRegex.test(numberString);
const isValidInBookNumber = (numberString: string) =>
	books.isValidInBookNumberStringRegex.test(numberString);

const _initIsPaidDirty = ({
	fields: {priceString, paidString},
}: {
	fields: Pick<State['fields'], 'priceString' | 'paidString'>;
}) => priceString !== '' || paidString !== '';

const _syncPaid = ({
	fields: {payment_method},
	config: {isPaidDirty, syncPaidPaymentMethods},
}: {
	fields: Pick<State['fields'], 'payment_method'>;
	config: Pick<State['config'], 'isPaidDirty' | 'syncPaidPaymentMethods'>;
}) => {
	return !isPaidDirty && syncPaidPaymentMethods.includes(payment_method);
};

const init = (consultation: ConsultationEditorInit): State => {
	const priceString = Number.isFinite(consultation.price)
		? String(consultation.price)
		: '';
	const paidString = Number.isFinite(consultation.paid)
		? String(consultation.paid)
		: '';

	const inBookNumberString =
		Number.isInteger(consultation.inBookNumber) &&
		consultation.inBookNumber !== undefined &&
		consultation.inBookNumber >= 1
			? String(consultation.inBookNumber)
			: '';

	const fields = {
		...defaultState.fields,
		...removeUndefined({
			_id: consultation._id,
			datetime: consultation.datetime,
			doneDatetime: consultation.doneDatetime,
			reason: consultation.reason,
			done: consultation.done,
			todo: consultation.todo,
			treatment: consultation.treatment,
			next: consultation.next,
			more: consultation.more,

			currency: consultation.currency,
			payment_method: consultation.payment_method,
			priceString,
			paidString,
			book: consultation.book,
			inBookNumberString,
		}),
	};

	const config = {
		...defaultState.config,
		...removeUndefined({
			syncPaidPaymentMethods: [],
			syncInBookNumber:
				consultation._id === undefined && inBookNumberString === '',
			priceWarning: isZero(priceString),
			priceError: !isValidAmount(priceString),
			paidError: !isValidAmount(paidString),
			isPaidDirty: _initIsPaidDirty({fields}),
			inBookNumberError: !isValidInBookNumber(inBookNumberString),
			inBookNumberDisabled:
				typeof consultation.book !== 'string' ||
				!isRealBookNumber(consultation.book),
		}),
	};

	const syncPaid = _syncPaid({
		fields,
		config,
	});

	return {
		fields,
		config: {
			...config,
			syncPaid,
		},
	};
};

type ConsultationFormFields = {
	_id: string | undefined;
	datetime: Date;
	doneDatetime?: Date;
	reason: string;
	done?: string;
	todo?: string;
	treatment?: string;
	next?: string;
	more?: string;
	currency: string;
	payment_method: PaymentMethod;
	priceString: string;
	paidString: string;
	book: string;
	inBookNumberString: string;
};

type ConsultationFormConfiguration = {
	lastInsertedId?: string;
	syncPaid: boolean;
	syncPaidPaymentMethods: PaymentMethod[];
	syncInBookNumber: boolean;
	loadingInBookNumber: boolean;
	priceWarning: boolean;
	priceError: boolean;
	paidError: boolean;
	inBookNumberError: boolean;
	inBookNumberDisabled: boolean;
	dirty: boolean;
	isPaidDirty: boolean;
	saving: boolean;
	lastSaveWasSuccessful: boolean;
};

export type State = {
	fields: ConsultationFormFields;
	config: ConsultationFormConfiguration;
};

const defaultDate = '1970-01-01';
const defaultTime = '00:00';

const datetimeParse = (date: string, time: string) =>
	dateParseISO(`${date}T${time}:00`);

export const defaultState: State = {
	fields: {
		_id: undefined,
		datetime: datetimeParse(defaultDate, defaultTime),
		doneDatetime: undefined,
		reason: '',
		done: '',
		todo: '',
		treatment: '',
		next: '',
		more: '',

		currency: 'EUR',
		payment_method: 'cash',
		priceString: '',
		paidString: '',
		book: '',
		inBookNumberString: '',
	},

	config: {
		syncPaid: true,
		syncPaidPaymentMethods: [],
		syncInBookNumber: false,
		loadingInBookNumber: false,
		priceWarning: false,
		priceError: true,
		paidError: true,
		inBookNumberError: true,
		inBookNumberDisabled: false,
		dirty: false,
		isPaidDirty: false,
		saving: false,
		lastSaveWasSuccessful: false,
		lastInsertedId: undefined,
	},
};

export type Action =
	| {type: 'update'; key: keyof State['fields']; value: string}
	| {type: 'save-success'; insertedId?: string}
	| {type: 'sync-in-book-number'; inBookNumber: number}
	| {
			type: 'sync-sync-paid-payment-methods';
			syncPaidPaymentMethods: PaymentMethod[];
	  }
	| {type: 'loading-next-in-book-number'}
	| {type: 'disable-in-book-number'}
	| {type: 'save'}
	| {type: 'save-failure'};

export const reducer = ({fields, config}: State, action: Action): State => {
	switch (action.type) {
		case 'update': {
			switch (action.key) {
				case '_id': {
					throw new Error('Cannot update _id.');
				}

				case 'payment_method': {
					const payment_method = action.value as PaymentMethod;
					const newFields = {
						...fields,
						payment_method,
					};
					return {
						fields: newFields,
						config: {
							...config,
							syncPaid: _syncPaid({fields: newFields, config}),
							dirty: true,
						},
					};
				}

				case 'paidString': {
					const paidString = action.value;
					return {
						fields: {
							...fields,
							paidString,
						},
						config: {
							...config,
							paidError: !isValidAmount(paidString),
							syncPaid: false,
							dirty: true,
							isPaidDirty: true,
						},
					};
				}

				case 'priceString': {
					const priceString = action.value;
					const paidString = config.syncPaid ? priceString : fields.paidString;
					const isPaidDirty = config.isPaidDirty || paidString !== priceString;
					return {
						fields: {
							...fields,
							priceString,
							paidString,
						},
						config: {
							...config,
							priceWarning: isZero(priceString),
							priceError: !isValidAmount(priceString),
							paidError: !isValidAmount(paidString),
							dirty: true,
							isPaidDirty,
						},
					};
				}

				case 'inBookNumberString': {
					const inBookNumberString = action.value;
					return {
						fields: {
							...fields,
							inBookNumberString,
						},
						config: {
							...config,
							inBookNumberError: !isValidInBookNumber(inBookNumberString),
							inBookNumberDisabled: !isRealBookNumber(fields.book),
							syncInBookNumber: false,
							dirty:
								config.dirty ||
								inBookNumberString !== fields.inBookNumberString,
						},
					};
				}

				default: {
					if (
						!Object.prototype.hasOwnProperty.call(
							defaultState.fields,
							action.key,
						)
					) {
						throw new Error(`Unknown key ${action.key}`);
					}

					return {
						fields: {
							...fields,
							[action.key]: action.value,
						},
						config: {
							...config,
							dirty: true,
						},
					};
				}
			}
		}

		case 'loading-next-in-book-number': {
			return {
				fields,
				config: {
					...config,
					loadingInBookNumber: true,
					inBookNumberDisabled: false,
					syncInBookNumber: true,
				},
			};
		}

		case 'disable-in-book-number': {
			return {
				fields: {
					...fields,
					inBookNumberString: '',
				},
				config: {
					...config,
					inBookNumberError: false,
					inBookNumberDisabled: true,
					loadingInBookNumber: false,
					syncInBookNumber: false,
					dirty: config.dirty || fields.inBookNumberString !== '',
				},
			};
		}

		case 'sync-in-book-number': {
			return {
				fields: {
					...fields,
					inBookNumberString: String(action.inBookNumber),
				},
				config: {
					...config,
					inBookNumberError: false,
					loadingInBookNumber: false,
					syncInBookNumber: true,
				},
			};
		}

		case 'save': {
			return {
				fields,
				config: {
					...config,
					saving: true,
				},
			};
		}

		case 'save-success': {
			if (action.insertedId) {
				return {
					fields,
					config: {
						...config,
						saving: false,
						dirty: false,
						lastSaveWasSuccessful: true,
						lastInsertedId: action.insertedId,
					},
				};
			}

			return {
				fields,
				config: {
					...config,
					saving: false,
					dirty: false,
					lastSaveWasSuccessful: true,
				},
			};
		}

		case 'save-failure': {
			return {
				fields,
				config: {
					...config,
					saving: false,
					lastSaveWasSuccessful: false,
				},
			};
		}

		case 'sync-sync-paid-payment-methods': {
			const {syncPaidPaymentMethods} = action;
			const {isPaidDirty} = config;

			return {
				fields,
				config: {
					...config,
					syncPaidPaymentMethods,
					syncPaid: _syncPaid({
						fields,
						config: {isPaidDirty, syncPaidPaymentMethods},
					}),
				},
			};
		}

		default: {
			// @ts-expect-error NOTE Can code defensively and be type-safe.
			throw new Error(`Unknown action type ${action.type}.`);
		}
	}
};
