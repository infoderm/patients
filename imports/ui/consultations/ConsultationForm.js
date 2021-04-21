import {Meteor} from 'meteor/meteor';

import React, {useReducer} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {useHistory} from 'react-router-dom';
import {Prompt} from 'react-router';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import WarningIcon from '@material-ui/icons/Warning';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import format from 'date-fns/format';

import {books, useBooksFind} from '../../api/books.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions.js';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions.js';

import confirm from '../modal/confirm.js';
import ConfirmationDialog from '../modal/ConfirmationDialog.js';

import ConsultationEditorHeader from './ConsultationEditorHeader.js';

const styles = (theme) => ({
	container: {
		paddingBottom: '6em'
	},
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`
	},
	form: {
		marginTop: 64 + theme.spacing(3),
		padding: theme.spacing(3)
	},
	saveButton: computeFixedFabStyle({theme, col: 2}),
	doneButton: computeFixedFabStyle({theme, col: 1}),
	hidden: {
		display: 'none'
	}
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
	dirty: false
};

const removeUndefined = (object) => {
	return Object.fromEntries(
		Object.entries(object).filter(([_key, value]) => value !== undefined)
	);
};

const init = (consultation) => ({
	...defaultState,
	...removeUndefined({
		date: format(consultation.datetime, 'yyyy-MM-dd'),
		time: format(consultation.datetime, 'HH:mm'),
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
		book: consultation.book
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

const ConsultationForm = ({consultation}) => {
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

		dirty
	} = state;

	const priceWarning = Number.parseInt(price, 10) === 0;

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

		if (consultationId === undefined) {
			Meteor.call(
				'consultations.insert',
				consultation,
				setDoneDatetime,
				(err, _id) => {
					if (err) {
						console.error(err);
					} else {
						dispatch({type: 'not-dirty'});
						history.push({pathname: `/consultation/${_id}`});
					}
				}
			);
		} else {
			Meteor.call(
				'consultations.update',
				consultationId,
				consultation,
				setDoneDatetime,
				(err, _res) => {
					if (err) {
						console.error(err);
					} else {
						dispatch({type: 'not-dirty'});
						history.push({pathname: `/consultation/${consultationId}`});
					}
				}
			);
		}
	};

	const update = (key, transform = (x) => x) => (e) => {
		dispatch({type: 'update', key, value: transform(e.target.value)});
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
			<Paper className={classes.form}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextField
							autoFocus
							multiline
							label="Motif de la visite"
							placeholder="Motif de la visite"
							rows={4}
							className={classes.multiline}
							value={reason}
							margin="normal"
							onChange={update('reason')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="Examens déjà réalisés"
							placeholder="Examens déjà réalisés"
							rows={4}
							className={classes.multiline}
							value={done}
							margin="normal"
							onChange={update('done')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="Examens à réaliser"
							placeholder="Examens à réaliser"
							rows={4}
							className={classes.multiline}
							value={todo}
							margin="normal"
							onChange={update('todo')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="Traitement"
							placeholder="Traitement"
							rows={4}
							className={classes.multiline}
							value={treatment}
							margin="normal"
							onChange={update('treatment')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="À revoir"
							placeholder="À revoir"
							rows={4}
							className={classes.multiline}
							value={next}
							margin="normal"
							onChange={update('next')}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="Autres remarques"
							placeholder="Write some additional information about the consultation here"
							rows={4}
							className={classes.multiline}
							value={more}
							margin="normal"
							onChange={update('more')}
						/>
					</Grid>

					<Grid item xs={1}>
						<TextField
							select
							label="Currency"
							value={currency}
							margin="normal"
							onChange={update('currency')}
						>
							<MenuItem value="EUR">€</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={1}>
						<TextField
							select
							label="Payment Method"
							value={payment_method}
							margin="normal"
							onChange={update('payment_method')}
						>
							<MenuItem value="cash">cash</MenuItem>
							<MenuItem value="wire">virement</MenuItem>
							<MenuItem value="third-party">tiers payant</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={3}>
						<TextField
							fullWidth
							label="Prix"
							value={price}
							margin="normal"
							error={!/^\d+$/.test(price)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											className={classNames({
												[classes.hidden]: !priceWarning
											})}
										>
											<WarningIcon />
										</IconButton>
									</InputAdornment>
								)
							}}
							onChange={update('price')}
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							label="Payé"
							value={paid}
							margin="normal"
							error={!/^\d+$/.test(paid)}
							onChange={update('paid')}
						/>
					</Grid>
					<Grid item xs={3}>
						<AutocompleteWithSuggestions
							itemToString={(x) => (x ? x.bookNumber : '')}
							useSuggestions={makeSubstringSuggestions(
								useBooksFind,
								[],
								'bookNumber'
							)}
							TextFieldProps={{
								label: 'Carnet',
								margin: 'normal'
							}}
							inputValue={book}
							onInputChange={(event, newInputValue) => {
								if (event) {
									return update(
										'book',
										books.sanitizeInput
									)({target: {value: newInputValue}});
								}
							}}
						/>
					</Grid>
				</Grid>
			</Paper>
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

ConsultationForm.propTypes = {
	consultation: PropTypes.object.isRequired
};

export default ConsultationForm;
