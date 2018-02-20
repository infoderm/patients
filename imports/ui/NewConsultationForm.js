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

const styles = theme => ({
	report: {
		margin: theme.spacing.unit,
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing.unit*2}px)`,
	},
});

class NewConsultationForm extends React.Component {

	constructor(props){
		super(props);

		const now = new Date().toISOString();

		this.state = {
			patientId: props.match.params.id,
			date: now.slice(0,10),
			time: now.slice(11,16),
			report: '',
		};

	}

	handleSubmit ( event ) {

		const { history } = this.props ;
		const { patientId, date, time, report } = this.state ;

		event.preventDefault();

		const datetime = new Date(`${date}T${time}`);

		Meteor.call('consultations.insert', {
			patientId,
			datetime,
			report,
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
						label="Report"
						placeholder="Write some information on the consultation here"
						multiline
						rows={10}
						className={classes.report}
						value={this.state.report}
						onChange={e => this.setState({ report: e.target.value})}
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
