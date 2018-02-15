import { Meteor } from 'meteor/meteor';

import React from 'react' ;

import Grid from 'material-ui/Grid';

import { FormControl } from 'material-ui/Form';
import Input , { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

export default class NewPatientForm extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			niss: '',
			firstname: '',
			lastname: '',
			birthdate: '',
			sex: '',
			photo: '',
		};

	}

	handleSubmit ( event ) {

		event.preventDefault();

		Meteor.call('patients.insert', this.state);

		this.setState({
			niss: '',
			firstname: '',
			lastname: '',
			birthdate: '',
			sex: '',
			photo: '',
		});

	}



	render(){
		return (
			<Grid container spacing={24}>
				<Grid item xs={2}>
					<TextField label="NISS" value={this.state.niss} onChange={e => this.setState({ niss: e.target.value})}/>
				</Grid>
				<Grid item xs={2}>
					<TextField label="First name" value={this.state.firstname} onChange={e => this.setState({ firstname: e.target.value})}/>
				</Grid>
				<Grid item xs={2}>
					<TextField label="Last name" value={this.state.lastname} onChange={e => this.setState({ lastname: e.target.value})}/>
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
					<Button variant="fab" color="primary" aria-label="add" onClick={this.handleSubmit.bind(this)}>
						<AddIcon />
					</Button>
				</Grid>
			</Grid>
		);
	}
}
