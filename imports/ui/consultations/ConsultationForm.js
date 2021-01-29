import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';
import {Prompt} from 'react-router';

import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import {format} from 'date-fns';

import {Patients} from '../../api/patients.js';
import {books, useBooksFind} from '../../api/books.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions.js';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions.js';

const styles = (theme) => ({
	container: {
		paddingBottom: '5em'
	},
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`
	},
	header: {
		backgroundColor: 'white',
		position: 'fixed',
		top: '76px',
		paddingTop: '0.4em',
		zIndex: 10,
		marginLeft: '-24px',
		marginRight: '-24px',
		boxShadow:
			'0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
	},
	form: {
		marginTop: '64px'
	},
	avatar: {
		width: '48px',
		height: '48px'
	},
	saveButton: computeFixedFabStyle({theme, col: 2}),
	doneButton: computeFixedFabStyle({theme, col: 1})
});

class ConsultationForm extends React.Component {
	constructor(props) {
		super(props);

		const {consultation} = props;

		this.state = {
			patientId: consultation.patientId,
			date: format(consultation.datetime, 'yyyy-MM-dd'),
			time: format(consultation.datetime, 'HH:mm'),
			reason: consultation.reason,
			done: consultation.done,
			todo: consultation.todo,
			treatment: consultation.treatment,
			next: consultation.next,
			more: consultation.more,

			currency: consultation.currency || 'EUR',
			payment_method: consultation.payment_method || 'cash',
			price: consultation.price,
			paid: consultation.paid,
			book: consultation.book,

			syncPaid: true,
			dirty: false
		};
	}

	handleSubmit = (setDoneDatetime) => (event) => {
		event.preventDefault();

		const {
			history,
			consultation: {_id: consultationId}
		} = this.props;

		const {
			patientId,
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
			book
		} = this.state;

		const datetime = new Date(`${date}T${time}`);

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

		if (consultationId === undefined) {
			Meteor.call(
				'consultations.insert',
				consultation,
				setDoneDatetime,
				(err, _id) => {
					if (err) {
						console.error(err);
					} else {
						this.setState({
							dirty: false
						});
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
						this.setState({
							dirty: false
						});
						history.push({pathname: `/consultation/${consultationId}`});
					}
				}
			);
		}
	};

	render() {
		const {
			classes,
			consultation: {doneDatetime},
			loadingPatient,
			patient
		} = this.props;

		const update = (key, transform = (x) => x) => (e) => {
			this.setState({
				[key]: transform(e.target.value),
				dirty: true
			});
		};

		return (
			<div className={classes.container}>
				<Prompt
					when={this.state.dirty}
					message="You are trying to leave the page without saving your changes. Are you sure you want to continue?"
				/>
				<Grid container className={classes.header} spacing={3}>
					{loadingPatient || !patient || !patient.photo ? (
						''
					) : (
						<Grid item xs={1}>
							<Avatar
								alt={`${patient.firstname} ${patient.lastname}`}
								src={`data:image/png;base64,${patient.photo}`}
								className={classes.avatar}
							/>
						</Grid>
					)}
					{loadingPatient || !patient ? (
						''
					) : (
						<Grid item xs={2}>
							<TextField
								inputProps={{readOnly: true}}
								label="Lastname"
								value={patient.lastname}
							/>
						</Grid>
					)}
					{loadingPatient || !patient ? (
						''
					) : (
						<Grid item xs={2}>
							<TextField
								inputProps={{readOnly: true}}
								label="Firstname"
								value={patient.firstname}
							/>
						</Grid>
					)}
					{loadingPatient || !patient ? (
						''
					) : (
						<Grid item xs={2}>
							<TextField
								inputProps={{readOnly: true}}
								label="NISS"
								value={patient.niss}
							/>
						</Grid>
					)}
					{!loadingPatient && patient ? (
						''
					) : (
						<Grid item xs={2}>
							<TextField
								disabled
								label="Patient id"
								value={this.state.patientId}
							/>
						</Grid>
					)}
					<Grid item xs={2}>
						<TextField
							type="date"
							label="Date"
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.date}
							onChange={update('date')}
						/>
					</Grid>
					<Grid item xs={1}>
						<TextField
							type="time"
							label="Time"
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.time}
							onChange={update('time')}
						/>
					</Grid>
				</Grid>
				<Grid container className={classes.form} spacing={3}>
					<Grid item xs={12}>
						<TextField
							autoFocus
							multiline
							label="Motif de la visite"
							placeholder="Motif de la visite"
							rows={4}
							className={classes.multiline}
							value={this.state.reason}
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
							value={this.state.done}
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
							value={this.state.todo}
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
							value={this.state.treatment}
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
							value={this.state.next}
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
							value={this.state.more}
							margin="normal"
							onChange={update('more')}
						/>
					</Grid>

					<Grid item xs={1}>
						<TextField
							select
							label="Currency"
							value={this.state.currency}
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
							value={this.state.payment_method}
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
							label="Prix"
							value={this.state.price}
							margin="normal"
							error={!/^\d+$/.test(this.state.price)}
							onChange={(e) => {
								const price = e.target.value;
								this.setState((state) => ({
									price,
									paid:
										state.syncPaid && state.payment_method === 'cash'
											? price
											: state.paid,
									dirty: true
								}));
							}}
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							label="Payé"
							value={this.state.paid}
							margin="normal"
							error={!/^\d+$/.test(this.state.paid)}
							onChange={(e) =>
								this.setState({
									paid: e.target.value,
									syncPaid: false,
									dirty: true
								})
							}
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
							inputValue={this.state.book}
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
				<Fab
					className={classes.saveButton}
					color={doneDatetime ? 'primary' : 'secondary'}
					aria-label="save"
					disabled={!this.state.dirty}
					onClick={this.handleSubmit(false)}
				>
					<SaveIcon />
				</Fab>
				<Fab
					className={classes.doneButton}
					color={!doneDatetime ? 'primary' : 'secondary'}
					aria-label="done"
					disabled={!this.state.dirty}
					onClick={this.handleSubmit(true)}
				>
					<AssignmentTurnedInIcon />
				</Fab>
			</div>
		);
	}
}

ConsultationForm.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default withRouter(
	withTracker(({consultation}) => {
		const _id = consultation.patientId;
		const handle = Meteor.subscribe('patient', _id);
		if (handle.ready()) {
			const patient = Patients.findOne(_id);
			return {loadingPatient: false, patient};
		}

		return {loadingPatient: true};
	})(withStyles(styles, {withTheme: true})(ConsultationForm))
);
