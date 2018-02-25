import { Meteor } from 'meteor/meteor';

import React from 'react' ;
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom' ;

import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import { FormControl } from 'material-ui/Form';
import Input , { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

import { format } from 'date-fns' ;

const styles = theme => ({
	multiline: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing.unit*2}px)`,
	},
});

class NewConsultationForm extends React.Component {

	constructor(props){
		super(props);

		const now = new Date();

		this.state = {
			patientId: props.match.params.id,
			date: format(now, 'YYYY-MM-DD'),
			time: format(now, 'HH:mm'),
			reason: '',
			done: '',
			todo: '',
			treatment: '',
			next: '',
			more: '',
		};

	}

	handleSubmit ( event ) {

		const { history } = this.props ;
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

		event.preventDefault();

		const datetime = new Date(`${date}T${time}`);

		Meteor.call('consultations.insert', {
			patientId,
			datetime,
			reason,
			done,
			todo,
			treatment,
			next,
			more,
		}, (err, _id) => {
			if ( err ) console.error(err) ;
			else history.push({pathname: `/consultation/${_id}`}) ;
		});

	}



	render(){

		const { classes } = this.props ;

		return (
			<Grid container spacing={24}>
				<Grid item xs={2}>
					<TextField disabled={true} label="Patient id" value={this.state.patientId} onChange={e => this.setState({ patientId: e.target.value})}/>
				</Grid>
				<Grid item xs={2}>
					<TextField type="date"
						label="Date"
						InputLabelProps={{
						  shrink: true,
						}}
						value={this.state.date}
						onChange={e => this.setState({ date: e.target.value})}
					/>
				</Grid>
				<Grid item xs={2}>
					<TextField type="time"
						label="Time"
						InputLabelProps={{
							shrink: true,
						}}
						value={this.state.time}
						onChange={e => this.setState({ time: e.target.value})}
					/>
				</Grid>
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
						<AddIcon />
					</Button>
				</Grid>
			</Grid>
		);
	}
}

NewConsultationForm.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};


export default withRouter(withStyles(styles)(NewConsultationForm));
