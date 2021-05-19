import React, {useState, useReducer} from 'react';

import {Prompt} from 'react-router';

import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import CompareIcon from '@material-ui/icons/Compare';
import SaveIcon from '@material-ui/icons/Save';

import dateFormat from 'date-fns/format';
import dateParseISO from 'date-fns/parseISO';

import call from '../../api/call.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import dialog from '../modal/dialog.js';
import ConfirmationDialog from '../modal/ConfirmationDialog.js';

import {computeFixedFabStyle} from '../button/FixedFab.js';

import ConsultationEditorHeader from './ConsultationEditorHeader.js';
import ConsultationForm from './ConsultationForm.js';
import PrecedingConsultationsList from './PrecedingConsultationsList.js';

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
	date: defaultDate,
	time: defaultTime,
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

const init = (consultation) => ({
	...defaultState,
	...removeUndefined({
		_id: consultation._id,
		datetime: consultation.datetime,
		date: dateFormat(consultation.datetime, 'yyyy-MM-dd'),
		time: dateFormat(consultation.datetime, 'HH:mm'),
		reason: consultation.reason,
		done: consultation.done,
		todo: consultation.todo,
		treatment: consultation.treatment,
		next: consultation.next,
		more: consultation.more,

		currency: consultation.currency,
		payment_method: consultation.payment_method,
		price: String(consultation.price),
		paid: String(consultation.paid),
		book: consultation.book,
		priceWarning: isZero(consultation.price)
	})
});

const reducer = (state, action) => {
	switch (action.type) {
		case 'update':
			switch (action.key) {
				case '_id':
					throw new Error('Cannot update _id.');
				case 'datetime':
					throw new Error('Cannot update datetime directly.');
				case 'date':
					return {
						...state,
						date: action.value,
						datetime: datetimeParse(action.value, state.time),
						dirty: true
					};
				case 'time':
					return {
						...state,
						time: action.value,
						datetime: datetimeParse(state.date, action.value),
						dirty: true
					};
				case 'paid':
					return {...state, paid: action.value, syncPaid: false, dirty: true};
				case 'price':
					return {
						...state,
						price: action.value,
						paid:
							state.syncPaid && state.payment_method === 'cash'
								? action.value
								: state.paid,
						priceWarning: isZero(action.value),
						dirty: true
					};
				default:
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
		priceWarning
	} = state;

	const update = (key, transform = (x) => x) => (e) => {
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
					text="This consultation has a price of 0."
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
				disabled={!dirty}
				onClick={handleSubmit}
			>
				<SaveIcon />
			</Fab>
		</div>
	);
};

export default Loader;
