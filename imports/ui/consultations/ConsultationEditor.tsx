import React, {useState, useReducer, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {makeStyles, createStyles} from '@mui/styles';

import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import {blue} from '@mui/material/colors';

import call from '../../api/endpoint/call';
import {ConsultationDocument} from '../../api/collection/consultations';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import useDialog from '../modal/useDialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import {computeFixedFabStyle} from '../button/FixedFab';

import insertConsultation from '../../api/endpoint/consultations/insert';
import updateConsultation from '../../api/endpoint/consultations/update';
import usePrompt from '../navigation/usePrompt';
import ConsultationEditorHeader from './ConsultationEditorHeader';
import ConsultationForm, {defaultState, State} from './ConsultationForm';
import PrecedingConsultationsList from './PrecedingConsultationsList';

const styles = (theme) =>
	createStyles({
		main: {
			marginTop: 64,
			paddingTop: theme.spacing(3),
		},
		compareButton: computeFixedFabStyle({theme, col: 2}),
		saveButtonWrapper: computeFixedFabStyle({theme, col: 1}),
		saveButtonProgress: {
			color: blue[500],
			position: 'absolute',
			top: -6,
			left: -6,
			zIndex: 1,
		},
	});

const useStyles = makeStyles(styles);

const removeUndefined = <T,>(object: T) =>
	Object.fromEntries(
		Object.entries(object).filter(([_key, value]) => value !== undefined),
	) as Partial<T>;

const isZero = (x: string) => Number.parseInt(x, 10) === 0;
const isValidAmount = (amount: string) => /^\d+$/.test(amount);

const isValidInBookNumber = (numberString: string) =>
	/^[1-9]\d*$/.test(numberString);
const init = (consultation: ConsultationDocument): State => {
	const priceString = Number.isFinite(consultation.price)
		? String(consultation.price)
		: '';
	const paidString = Number.isFinite(consultation.paid)
		? String(consultation.paid)
		: '';

	const inBookNumberString =
		Number.isInteger(consultation.inBookNumber) &&
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
			priceWarning: isZero(priceString),
			priceError: !isValidAmount(priceString),
			paidError: !isValidAmount(paidString),
			inBookNumberError: !isValidInBookNumber(inBookNumberString),
		}),
	};
};

interface Action {
	type: string;
	key?: string;
	value?: any;
	insertedId?: string;
}

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'update':
			switch (action.key) {
				case '_id':
					throw new Error('Cannot update _id.');
				case 'dirty':
					throw new Error('Cannot update dirty.');
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
						dirty: true,
					};
				}

				default:
					if (!Object.prototype.hasOwnProperty.call(defaultState, action.key)) {
						throw new Error(`Unknown key ${action.key}`);
					}

					return {...state, [action.key]: action.value, dirty: true};
			}

		case 'save':
			return {...state, saving: true};
		case 'save-success':
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

		case 'save-failure':
			return {...state, saving: false, lastSaveWasSuccessful: false};
		case 'not-dirty':
			return {...state, dirty: false};
		default:
			throw new Error(`Unknown action type ${action.type}.`);
	}
};

const Loader = ({loading, found, consultation}) => {
	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	return <ConsultationEditor consultation={consultation} />;
};

const ConsultationEditor = ({consultation}) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const dialog = useDialog();

	const [compare, setCompare] = useState(false);

	const {_id: consultationId, patientId} = consultation;

	const [state, dispatch] = useReducer(reducer, consultation, init);

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

	const showSuccess = !dirty && lastSaveWasSuccessful;

	const update =
		(key, transform = (x) => x) =>
		(e) => {
			dispatch({type: 'update', key, value: transform(e.target.value)});
		};

	const handleSave = async (event) => {
		event.preventDefault();

		const consultation = {
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
			price: Number.parseInt(priceString, 10),
			paid: Number.parseInt(paidString, 10),
			book,
			inBookNumber: Number.parseInt(inBookNumberString, 10),
		};

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
				const {insertedId} = await call(insertConsultation, consultation);
				dispatch({type: 'save-success', insertedId});
			} else {
				await call(updateConsultation, consultationId, consultation);
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
			<Grid container className={classes.main} spacing={3}>
				{compare && (
					<Grid item xs={6}>
						<PrecedingConsultationsList consultation={consultation} />
					</Grid>
				)}
				<Grid item xs={compare ? 6 : 12}>
					<ConsultationForm consultation={state} update={update} />
				</Grid>
			</Grid>
			<Fab
				className={classes.compareButton}
				color={compare ? 'primary' : 'default'}
				aria-label="compare"
				onClick={() => {
					setCompare(!compare);
				}}
			>
				<VerticalSplitIcon />
			</Fab>
			<div className={classes.saveButtonWrapper}>
				<Fab
					color="primary"
					aria-label="save"
					disabled={!dirty || saving}
					onClick={handleSave}
				>
					{showSuccess ? <CheckIcon /> : <SaveIcon />}
				</Fab>
				{saving && (
					<CircularProgress size={68} className={classes.saveButtonProgress} />
				)}
			</div>
		</div>
	);
};

export default Loader;
