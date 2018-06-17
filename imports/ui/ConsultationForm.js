import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom' ;

import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar'

import { FormControl } from 'material-ui/Form';
import Input , { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';

import { format } from 'date-fns' ;

import { Patients } from '../api/patients.js';

const styles = theme => ({
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
		} ;

		if ( consultationId === undefined ) {
			Meteor.call('consultations.insert', consultation, (err, _id) => {
				if ( err ) console.error(err) ;
				else history.push({pathname: `/consultation/${_id}`}) ;
			});
		}
		else {
			Meteor.call('consultations.update', consultationId, consultation, (err, res) => {
				if ( err ) console.error(err) ;
				else history.push({pathname: `/consultation/${consultationId}`}) ;
			});
		}
	}



	render(){

		const { classes , consultation : { _id : consultationId }, loadingPatient, patient } = this.props ;

		return (
			<div>
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
						<TextField inputProps={{readOnly: true}} label="Firstname" value={patient.firstname}/>
					</Grid>
					}
					{(loadingPatient || !patient) ? '' :
					<Grid item xs={2}>
						<TextField inputProps={{readOnly: true}} label="Lastname" value={patient.lastname}/>
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
					<Grid item xs={1}>
						<TextField type="date"
							label="Date"
							InputLabelProps={{
							  shrink: true,
							}}
							value={this.state.date}
							onChange={e => this.setState({ date: e.target.value})}
						/>
					</Grid>
					<Grid item xs={1}>
						<TextField type="time"
							label="Time"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.time}
							onChange={e => this.setState({ time: e.target.value})}
						/>
					</Grid>
					<Grid item xs={1}>
						<Button variant="fab" mini={true} color="primary" aria-label="add" onClick={this.handleSubmit.bind(this)}>
							{consultationId === undefined ? <AddIcon/> : <EditIcon/>}
						</Button>
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
							onChange={e => this.setState({ reason: e.target.value})}
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
							onChange={e => this.setState({ done: e.target.value})}
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
							onChange={e => this.setState({ todo: e.target.value})}
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
							onChange={e => this.setState({ treatment: e.target.value})}
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
							onChange={e => this.setState({ next: e.target.value})}
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
							onChange={e => this.setState({ more: e.target.value})}
							margin="normal"
						/>
					</Grid>
					<Grid item xs={2}>
						<Button variant="fab" color="primary" aria-label="add" onClick={this.handleSubmit.bind(this)}>
							{consultationId === undefined ? <AddIcon/> : <EditIcon/>}
						</Button>
					</Grid>
				</Grid>
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
