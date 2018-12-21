import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom' ;
import { Prompt } from 'react-router';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar'

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import { format } from 'date-fns' ;

import { Patients } from '../../api/patients.js';

const styles = theme => ({
	container: {
		paddingBottom: '5em',
	},
	multiline: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing.unit*2}px)`,
	},
	header: {
		backgroundColor: 'white',
		position: 'fixed',
		top: '76px',
		paddingTop: '1em',
		zIndex: 10,
		marginLeft: '-24px',
		marginRight: '-24px',
		boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
	},
	form: {
		marginTop: '64px',
	},
	avatar: {
		width: '48px',
		height: '48px',
	},
	fab: {
		position: 'fixed',
		bottom: theme.spacing.unit * 3,
		right: theme.spacing.unit * 3,
	},
});

class ConsultationForm extends React.Component {

	constructor(props){
		super(props);

		const { consultation } = props ;

		this.state = {
			patientId: consultation.patientId,
			date: format(consultation.datetime, 'YYYY-MM-DD'),
			time: format(consultation.datetime, 'HH:mm'),
			reason: consultation.reason,
			done: consultation.done,
			todo: consultation.todo,
			treatment: consultation.treatment,
			next: consultation.next,
			more: consultation.more,

			currency: consultation.currency || 'EUR',
			price: consultation.price,
			paid: consultation.paid,
			book: consultation.book,

			syncPaid: true,
			dirty: false,

		};

	}

	handleSubmit ( event ) {

		event.preventDefault();

		const { history , consultation : { _id : consultationId } } = this.props ;

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
			price,
			paid,
			book,
		} = this.state ;

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
			price: parseInt(price,10),
			paid: parseInt(paid,10),
			book,
		} ;

		if ( consultationId === undefined ) {
			Meteor.call('consultations.insert', consultation, (err, _id) => {
				if ( err ) console.error(err) ;
				else {
					this.setState({
						dirty: false,
					});
					history.push({pathname: `/consultation/${_id}`}) ;
				}
			});
		}
		else {
			Meteor.call('consultations.update', consultationId, consultation, (err, res) => {
				if ( err ) console.error(err) ;
				else {
					this.setState({
						dirty: false,
					});
					history.push({pathname: `/consultation/${consultationId}`}) ;
				}
			});
		}
	}



	render(){

		const {
			classes ,
			consultation : {
				_id : consultationId
			},
			loadingPatient,
			patient,
		} = this.props ;

		const update = key => e => {
			this.setState({
				[key]: e.target.value,
				dirty: true,
			});
		} ;

		return (
			<div className={classes.container}>
				<Prompt
					when={this.state.dirty}
					message="You are trying to leave the page without saving your changes. Are you sure you want to continue?"
				/>
				<Grid className={classes.header} container spacing={24}>
					{(loadingPatient || !patient || !patient.photo) ? '' :
					<Grid item xs={1}>
					<Avatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={`data:image/png;base64,${patient.photo}`}
						className={classes.avatar}
						/>
					</Grid>
					}
					{(loadingPatient || !patient) ? '' :
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="Lastname" value={patient.lastname}/>
					</Grid>
					}
					{(loadingPatient || !patient) ? '' :
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="Firstname" value={patient.firstname}/>
					</Grid>
					}
					{(loadingPatient || !patient) ? '' :
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="NISS" value={patient.niss}/>
					</Grid>
					}
					{(!loadingPatient && patient) ? '' :
					<Grid item xs={2}>
						<TextField disabled={true} label="Patient id" value={this.state.patientId}/>
					</Grid>
					}
					<Grid item xs={2}>
						<TextField type="date"
							label="Date"
							InputLabelProps={{
							  shrink: true,
							}}
							value={this.state.date}
							onChange={update('date')}
						/>
					</Grid>
					<Grid item xs={1}>
						<TextField type="time"
							label="Time"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.time}
							onChange={update('time')}
						/>
					</Grid>
				</Grid>
				<Grid className={classes.form} container spacing={24}>
					<Grid item xs={12}>
						<TextField
							autoFocus
							label="Motif de la visite"
							placeholder="Motif de la visite"
							multiline
							rows={4}
							className={classes.multiline}
							value={this.state.reason}
							onChange={update('reason')}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Examens déjà réalisés"
							placeholder="Examens déjà réalisés"
							multiline
							rows={4}
							className={classes.multiline}
							value={this.state.done}
							onChange={update('done')}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Examens à réaliser"
							placeholder="Examens à réaliser"
							multiline
							rows={4}
							className={classes.multiline}
							value={this.state.todo}
							onChange={update('todo')}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Traitement"
							placeholder="Traitement"
							multiline
							rows={4}
							className={classes.multiline}
							value={this.state.treatment}
							onChange={update('treatment')}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="À revoir"
							placeholder="À revoir"
							multiline
							rows={4}
							className={classes.multiline}
							value={this.state.next}
							onChange={update('next')}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Autres remarques"
							placeholder="Write some additional information about the consultation here"
							multiline
							rows={4}
							className={classes.multiline}
							value={this.state.more}
							onChange={update('more')}
							margin="normal"
						/>
					</Grid>

					<Grid item xs={3}>
						<TextField
							select
							label="Currency"
							value={this.state.currency}
							onChange={update('currency')}
							margin="normal"
						>
							<MenuItem value="EUR">€</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={3}>
						<TextField
							label="Prix"
							value={this.state.price}
							onChange={e => this.setState({
								price: e.target.value ,
								paid: this.state.syncPaid ? e.target.value : this.state.paid,
								dirty: true,
							})}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							label="Payé"
							value={this.state.paid}
							onChange={e => this.setState({
								paid : e.target.value ,
								syncPaid: false ,
								dirty: true ,
							})}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField
							label="Carnet"
							value={this.state.book}
							onChange={update('book')}
							margin="normal"
						/>
					</Grid>
				</Grid>
				<Fab className={classes.fab} color="primary" aria-label="save" onClick={this.handleSubmit.bind(this)}>
					<SaveIcon/>
				</Fab>
			</div>
		);
	}
}

ConsultationForm.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default withRouter(withTracker(({consultation}) => {
	const _id = consultation.patientId;
	const handle = Meteor.subscribe('patient', _id);
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		return { loadingPatient: false, patient } ;
	}
	else return { loadingPatient: true } ;
}) ( withStyles(styles, { withTheme: true})(ConsultationForm) ) ) ;
