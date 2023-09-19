import React, {
	useState,
	useReducer,
	useEffect,
	type Dispatch,
	type ReducerAction,
} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';

import removeUndefined from '../../lib/object/removeUndefined';
import call from '../../api/endpoint/call';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import useDialog from '../modal/useDialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import FixedFab from '../button/FixedFab';

import insertConsultation from '../../api/endpoint/consultations/insert';
import updateConsultation from '../../api/endpoint/consultations/update';
import usePrompt from '../navigation/usePrompt';
import {books} from '../../api/books';
import {documentDiff} from '../../api/update';
import {parseNonNegativeIntegerStrictOrNull} from '../../api/string';

import ConsultationEditorHeader from './ConsultationEditorHeader';
import ConsultationForm, {defaultState, type State} from './ConsultationForm';
import PrecedingConsultationsList from './PrecedingConsultationsList';
import useNextInBookNumber from './useNextInBookNumber';

type ConsultationEditorFields = {
	_id: string | undefined;
	isDone: boolean;
	patientId: string;
	datetime: Date;
	doneDatetime?: Date;
	reason: string;
	done?: string;
	todo?: string;
	treatment?: string;
	next?: string;
	more?: string;
	currency?: string;
	payment_method?: string;
	price?: number;
	paid?: number;
	book?: string;
	inBookNumber?: number;
};

const Main = styled(Grid)(({theme}) => ({
	marginTop: 64,
	paddingTop: theme.spacing(3),
}));

const isZero = (x: string) => Number.parseInt(x, 10) === 0;
const isValidAmount = (amount: string) => /^\d+$/.test(amount);
const isRealBookNumber = (numberString: string) =>
	books.isRealBookNumberStringRegex.test(numberString);
const isValidInBookNumber = (numberString: string) =>
	books.isValidInBookNumberStringRegex.test(numberString);
const init = (consultation: ConsultationEditorFields): State => {
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
	return {
		...defaultState,
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

			syncPaid: priceString === paidString,
			syncInBookNumber:
				consultation._id === undefined && inBookNumberString === '',
			priceWarning: isZero(priceString),
			priceError: !isValidAmount(priceString),
			paidError: !isValidAmount(paidString),
			inBookNumberError: !isValidInBookNumber(inBookNumberString),
			inBookNumberDisabled:
				typeof consultation.book !== 'string' ||
				!isRealBookNumber(consultation.book),
		}),
	};
};

type Action =
	| ({type: 'update'} & (
			| {key: 'paidString'; value: string}
			| {key: 'priceString'; value: string}
			| {key: 'inBookNumberString'; value: string}
			| {key: string; value: string}
	  ))
	| {type: 'save-success'; insertedId?: string}
	| {type: 'sync-in-book-number'; inBookNumber: number}
	| {type: 'loading-next-in-book-number'}
	| {type: 'disable-in-book-number'}
	| {type: 'save'}
	| {type: 'save-failure'}
	| {type: 'not-dirty'};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'update': {
			switch (action.key) {
				case '_id': {
					throw new Error('Cannot update _id.');
				}

				case 'dirty': {
					throw new Error('Cannot update dirty.');
				}

				case 'paidString': {
					const paidString = action.value;
					return {
						...state,
						paidString,
						paidError: !isValidAmount(paidString),
						syncPaid: false,
						dirty: true,
					};
				}

				case 'priceString': {
					const priceString = action.value;
					const paidString =
						state.syncPaid && state.payment_method === 'cash'
							? priceString
							: state.paidString;
					return {
						...state,
						priceString,
						priceWarning: isZero(priceString),
						priceError: !isValidAmount(priceString),
						paidString,
						paidError: !isValidAmount(paidString),
						dirty: true,
					};
				}

				case 'inBookNumberString': {
					const inBookNumberString = action.value;
					return {
						...state,
						inBookNumberString,
						inBookNumberError: !isValidInBookNumber(inBookNumberString),
						inBookNumberDisabled: !isRealBookNumber(state.book),
						syncInBookNumber: false,
						dirty:
							state.dirty || inBookNumberString !== state.inBookNumberString,
					};
				}

				default: {
					if (!Object.prototype.hasOwnProperty.call(defaultState, action.key)) {
						throw new Error(`Unknown key ${action.key}`);
					}

					return {...state, [action.key]: action.value, dirty: true};
				}
			}
		}

		case 'loading-next-in-book-number': {
			return {
				...state,
				loadingInBookNumber: true,
				inBookNumberDisabled: false,
				syncInBookNumber: true,
			};
		}

		case 'disable-in-book-number': {
			return {
				...state,
				inBookNumberString: '',
				inBookNumberError: false,
				inBookNumberDisabled: true,
				syncInBookNumber: false,
				dirty: state.dirty || state.inBookNumberString !== '',
			};
		}

		case 'sync-in-book-number': {
			return {
				...state,
				inBookNumberString: String(action.inBookNumber),
				inBookNumberError: false,
				loadingInBookNumber: false,
				syncInBookNumber: true,
			};
		}

		case 'save': {
			return {...state, saving: true};
		}

		case 'save-success': {
			if (action.insertedId) {
				return {
					...state,
					saving: false,
					dirty: false,
					lastSaveWasSuccessful: true,
					lastInsertedId: action.insertedId,
				};
			}

			return {
				...state,
				saving: false,
				dirty: false,
				lastSaveWasSuccessful: true,
			};
		}

		case 'save-failure': {
			return {...state, saving: false, lastSaveWasSuccessful: false};
		}

		case 'not-dirty': {
			return {...state, dirty: false};
		}

		default: {
			// @ts-expect-error NOTE Can code defensively and be type-safe.
			throw new Error(`Unknown action type ${action.type}.`);
		}
	}
};

type LoaderProps =
	| {loading: true; found: any; consultation: any}
	| {loading: false; found: false; consultation: any}
	| {loading: false; found: true; consultation: ConsultationEditorFields};

const Loader = (props: LoaderProps) => {
	if (props.loading) return <Loading />;

	if (!props.found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	const {consultation} = props;

	if (!consultation.isDone) return <Loading />;

	return <ConsultationEditor consultation={consultation} />;
};

const useConsultationEditorState = (consultation: ConsultationEditorFields) =>
	useReducer(reducer, consultation, init);

const useInBookNumberEffect = (
	{
		_id: consultationId,
		book: initBook,
		inBookNumber: initInBookNumber,
	}: ConsultationEditorFields,
	{book, syncInBookNumber}: State,
	dispatch: Dispatch<ReducerAction<typeof reducer>>,
) => {
	const {loading, inBookNumber} = useNextInBookNumber(book);

	useEffect(() => {
		if (book === initBook && consultationId !== undefined) {
			const value = String(initInBookNumber ?? '');
			dispatch({type: 'update', key: 'inBookNumberString', value});
		} else if (books.isRealBookNumberStringRegex.test(book)) {
			dispatch({type: 'loading-next-in-book-number'});
		} else {
			dispatch({type: 'disable-in-book-number'});
		}
	}, [consultationId, book, initBook, initInBookNumber]);

	useEffect(() => {
		if (!loading && syncInBookNumber) {
			dispatch({type: 'sync-in-book-number', inBookNumber});
		}
	}, [loading, syncInBookNumber, inBookNumber]);
};

type ConsultationEditorProps = {
	readonly consultation: ConsultationEditorFields;
};

const ConsultationEditor = ({consultation}: ConsultationEditorProps) => {
	const navigate = useNavigate();
	const dialog = useDialog();

	const [compare, setCompare] = useState(false);

	const {_id: consultationId, patientId} = consultation;

	const [state, dispatch] = useConsultationEditorState(consultation);

	const {
		datetime,
		reason,
		done,
		todo,
		treatment,
		next,
		more,

		currency,
		payment_method,
		priceString,
		paidString,
		book,

		inBookNumberString,
		dirty,
		saving,
		lastSaveWasSuccessful,
		lastInsertedId,
		priceWarning,
	} = state;

	usePrompt(
		'You are trying to leave the page without saving your changes. Are you sure you want to continue?',
		dirty,
	);

	useEffect(() => {
		if (lastSaveWasSuccessful && lastInsertedId) {
			navigate(`/edit/consultation/${lastInsertedId}`);
		}
	}, [navigate, lastSaveWasSuccessful, lastInsertedId]);

	useInBookNumberEffect(consultation, state, dispatch);

	const showSuccess = !dirty && lastSaveWasSuccessful;

	const update =
		(key, transform = (x) => x) =>
		(e) => {
			dispatch({type: 'update', key, value: transform(e.target.value)});
		};

	const handleSave = async (event) => {
		event.preventDefault();

		const updatedConsultationDocument = removeUndefined({
			patientId,
			datetime,
			reason,
			done,
			todo,
			treatment,
			next,
			more,

			currency,
			payment_method,
			price: parseNonNegativeIntegerStrictOrNull(priceString),
			paid: parseNonNegativeIntegerStrictOrNull(paidString),
			book,
			inBookNumber: parseNonNegativeIntegerStrictOrNull(inBookNumberString),
		});

		if (
			priceWarning &&
			!(await dialog((resolve) => (
				<ConfirmationDialog
					title="Confirm"
					text={`This consultation has a price of ${priceString}.`}
					cancel="Cancel"
					confirm={
						consultationId === undefined
							? 'Create consultation anyway'
							: 'Update consultation anyway'
					}
					onCancel={() => {
						resolve(false);
					}}
					onConfirm={() => {
						resolve(true);
					}}
				/>
			)))
		)
			return;

		dispatch({type: 'save'});

		try {
			if (consultationId === undefined) {
				const {insertedId} = await call(
					insertConsultation,
					updatedConsultationDocument,
				);
				dispatch({type: 'save-success', insertedId});
			} else {
				const consultationUpdate = documentDiff(
					consultation,
					updatedConsultationDocument,
				);
				await call(updateConsultation, consultationId, consultationUpdate);
				dispatch({type: 'save-success'});
			}
		} catch (error: unknown) {
			console.error(error);
			dispatch({type: 'save-failure'});
		}
	};

	return (
		<div>
			<ConsultationEditorHeader
				consultation={consultation}
				state={state}
				update={update}
			/>
			<Main container spacing={3}>
				{compare && (
					<Grid item xs={12} lg={6} xl={4}>
						<PrecedingConsultationsList consultation={consultation} />
					</Grid>
				)}
				<Grid item xs={12} lg={compare ? 6 : 12} xl={compare ? 8 : 12}>
					<ConsultationForm consultation={state} update={update} />
				</Grid>
			</Main>
			<FixedFab
				col={2}
				color={compare ? 'primary' : 'default'}
				aria-label="compare"
				onClick={() => {
					setCompare(!compare);
				}}
			>
				<VerticalSplitIcon />
			</FixedFab>
			<FixedFab
				col={1}
				color="primary"
				aria-label={showSuccess ? 'saved' : 'save'}
				disabled={!dirty}
				pending={saving}
				onClick={handleSave}
			>
				{showSuccess ? <CheckIcon /> : <SaveIcon />}
			</FixedFab>
		</div>
	);
};

export default Loader;
