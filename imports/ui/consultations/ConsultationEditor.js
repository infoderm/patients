import React, {useReducer} from 'react';

import {useHistory} from 'react-router-dom';
import {Prompt} from 'react-router';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import dateFormat from 'date-fns/format';

import call from '../../api/call.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import confirm from '../modal/confirm.js';
import ConfirmationDialog from '../modal/ConfirmationDialog.js';

import {computeFixedFabStyle} from '../button/FixedFab.js';

import ConsultationEditorHeader from './ConsultationEditorHeader.js';
import ConsultationForm from './ConsultationForm.js';

const styles = (theme) => ({
	container: {
		paddingBottom: '6em'
	},
	saveButton: computeFixedFabStyle({theme, col: 2}),
	doneButton: computeFixedFabStyle({theme, col: 1})
});

const useStyles = makeStyles(styles);

const defaultState = {
	date: '1970-01-01',
	time: '00:00',
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
	const history = useHistory();

	const {_id: consultationId, patientId, doneDatetime} = consultation;

	const [state, dispatch] = useReducer(reducer, consultation, init);

	const {
		date,
		time,
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

	const handleSubmit = (setDoneDatetime) => async (event) => {
		event.preventDefault();

		const consultation = {
			patientId,
			datetime: new Date(`${date}T${time}`),
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
			!(await confirm((resolve) => (
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
			const res = await (consultationId === undefined
				? call('consultations.insert', consultation, setDoneDatetime)
				: call(
						'consultations.update',
						consultationId,
						consultation,
						setDoneDatetime
				  ));
			dispatch({type: 'not-dirty'});
			history.push({pathname: `/consultation/${consultationId ?? res}`});
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
			<ConsultationForm consultation={state} update={update} />
			<Fab
				className={classes.saveButton}
				color={doneDatetime ? 'primary' : 'secondary'}
				aria-label="save"
				disabled={!dirty}
				onClick={handleSubmit(false)}
			>
				<SaveIcon />
			</Fab>
			<Fab
				className={classes.doneButton}
				color={!doneDatetime ? 'primary' : 'secondary'}
				aria-label="done"
				disabled={!dirty}
				onClick={handleSubmit(true)}
			>
				<AssignmentTurnedInIcon />
			</Fab>
		</div>
	);
};

export default Loader;
