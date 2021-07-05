import React, {useState, useReducer} from 'react';

import {Prompt} from 'react-router';

import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import CompareIcon from '@material-ui/icons/Compare';
import SaveIcon from '@material-ui/icons/Save';

import dateParseISO from 'date-fns/parseISO';

import call from '../../api/call';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import dialog from '../modal/dialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import {computeFixedFabStyle} from '../button/FixedFab';

import ConsultationEditorHeader from './ConsultationEditorHeader';
import ConsultationForm from './ConsultationForm';
import PrecedingConsultationsList from './PrecedingConsultationsList';

const styles = (theme) => ({
	container: {
		paddingBottom: '6em'
	},
	main: {
		marginTop: 64 + theme.spacing(3)
	},
	compareButton: computeFixedFabStyle({theme, col: 2}),
	saveButton: computeFixedFabStyle({theme, col: 1})
});

const useStyles = makeStyles(styles);

const defaultDate = '1970-01-01';
const defaultTime = '00:00';

const datetimeParse = (date, time) => dateParseISO(`${date}T${time}:00`);

const defaultState = {
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
	price: '',
	paid: '',
	book: '',

	syncPaid: true,
	priceWarning: false,
	dirty: false
};

const removeUndefined = (object) => {
	return Object.fromEntries(
		Object.entries(object).filter(([_key, value]) => value !== undefined)
	);
};

const isZero = (x) => Number.parseInt(String(x), 10) === 0;
const isValidAmount = (amount) => /^\d+$/.test(amount);

const init = (consultation) => ({
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
		price: Number.isFinite(consultation.price)
			? String(consultation.price)
			: undefined,
		paid: Number.isFinite(consultation.paid)
			? String(consultation.paid)
			: undefined,
		book: consultation.book,
		priceWarning: isZero(consultation.price),
		priceError: !isValidAmount(consultation.price),
		paidError: !isValidAmount(consultation.paid)
	})
});

/**
 * reducer.
 *
 * @param {Object} state
 * @param {{type: string, key?: string, value?: any}} action
 */
const reducer = (state, action) => {
	switch (action.type) {
		case 'update':
			switch (action.key) {
				case '_id':
					throw new Error('Cannot update _id.');
				case 'dirty':
					throw new Error('Cannot update dirty.');
				case 'paid': {
					const paid = action.value;
					return {
						...state,
						paid,
						paidError: !isValidAmount(paid),
						syncPaid: false,
						dirty: true
					};
				}

				case 'price': {
					const price = action.value;
					const paid =
						state.syncPaid && state.payment_method === 'cash'
							? price
							: state.paid;
					return {
						...state,
						price,
						priceWarning: isZero(price),
						priceError: !isValidAmount(price),
						paid,
						paidError: !isValidAmount(paid),
						dirty: true
					};
				}

				default:
					if (!Object.prototype.hasOwnProperty.call(defaultState, action.key)) {
						throw new Error(`Unknown key ${action.key}`);
					}

					return {...state, [action.key]: action.value, dirty: true};
			}

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
		price,
		paid,
		book,

		dirty,
		priceWarning,
		priceError,
		paidError
	} = state;

	const update =
		(key, transform = (x) => x) =>
		(e) => {
			dispatch({type: 'update', key, value: transform(e.target.value)});
		};

	const handleSubmit = async (event) => {
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
			price: Number.parseInt(price, 10),
			paid: Number.parseInt(paid, 10),
			book
		};

		if (
			priceWarning &&
			!(await dialog((resolve) => (
				<ConfirmationDialog
					title="Confirm"
					text={`This consultation has a price of ${price}.`}
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

		try {
			await (consultationId === undefined
				? call('consultations.insert', consultation)
				: call('consultations.update', consultationId, consultation));
			dispatch({type: 'not-dirty'});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={classes.container}>
			<Prompt
				when={dirty}
				message="You are trying to leave the page without saving your changes. Are you sure you want to continue?"
			/>
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
				onClick={() => setCompare(!compare)}
			>
				<CompareIcon />
			</Fab>
			<Fab
				className={classes.saveButton}
				color="primary"
				aria-label="save"
				disabled={!dirty || priceError || paidError}
				onClick={handleSubmit}
			>
				<SaveIcon />
			</Fab>
		</div>
	);
};

export default Loader;
