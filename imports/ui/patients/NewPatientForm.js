import { Meteor } from 'meteor/meteor';

import React from 'react' ;
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom' ;

import Grid from '@material-ui/core/Grid';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class NewPatientForm extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			niss: '',
			firstname: '',
			lastname: '',
			birthdate: '',
			sex: '',
		};

	}

	handleSubmit ( event ) {

		const { history } = this.props ;
		const patient = this.state ;

		event.preventDefault();

		Meteor.call('patients.insert', patient, (err, _id) => {
			if ( err ) console.error(err) ;
			else history.push({pathname: `/patient/${_id}`}) ;
		});

	}



	render(){
		return (
			<Grid container spacing={24} style={{ padding: 12 }}>
				<Grid item xs={2}>
					<TextField label="NISS" value={this.state.niss} onChange={e => this.setState({ niss: e.target.value})}/>
				</Grid>
				<Grid item xs={2}>
					<TextField label="Last name" value={this.state.lastname} onChange={e => this.setState({ lastname: e.target.value})}/>
				</Grid>
				<Grid item xs={2}>
					<TextField label="First name" value={this.state.firstname} onChange={e => this.setState({ firstname: e.target.value})}/>
				</Grid>
				<Grid item xs={2}>
					<FormControl>
						<InputLabel htmlFor="sex-input">Sex</InputLabel>
						<Select
							value={this.state.sex}
							onChange={e => this.setState({ sex: e.target.value})}
							input={<Input id="sex-input" />}
							inputProps={{
								name: 'sex',
								id: 'sex-input',
							}}
						>
							<MenuItem value=""><em>None</em></MenuItem>
							<MenuItem value="female">Female</MenuItem>
							<MenuItem value="male">Male</MenuItem>
							<MenuItem value="other">Other</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<TextField type="date"
						s={2}
						label="Birth date"
						InputLabelProps={{
						  shrink: true,
						}}
						value={this.state.birthdate}
						onChange={e => this.setState({ birthdate: e.target.value})}
					/>
				</Grid>
				<Grid item xs={2}>
					<Fab color="primary" aria-label="add" onClick={this.handleSubmit.bind(this)}>
						<AddIcon />
					</Fab>
				</Grid>
			</Grid>
		);
	}
}

NewPatientForm.propTypes = {
	history: PropTypes.object.isRequired,
};


export default withRouter(NewPatientForm);
