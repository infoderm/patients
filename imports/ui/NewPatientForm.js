import { Meteor } from 'meteor/meteor';

import React from 'react' ;

import Grid from 'material-ui/Grid';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField'
import Input , { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

import { xml2json } from 'xml-js';

export default class NewPatientForm extends React.Component {

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

		event.preventDefault();

		Meteor.call('patients.insert', this.state);

		this.setState({
			niss: '',
			firstname: '',
			lastname: '',
			birthdate: '',
			sex: '',
		});

	}

	handleDrop ( event ) {

		event.preventDefault();

		// TODO validate using xsd
		const xmlString = event.dataTransfer.getData('text/plain');
		const jsonString = xml2json(xmlString, {compact: true, spaces: 4});
		const json = JSON.parse(jsonString);
		console.log(json);

		const identity = json.eid.identity ;
		const attributes = identity._attributes ;
		const d = attributes.dateofbirth;

		Meteor.call('patients.insert', {
			niss: attributes.nationalnumber,
			firstname: identity.firstname._text,
			lastname: identity.name._text,
			photo: identity.photo._text,
			birthdate: `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,
			sex: attributes.gender,
		});

	}


	render(){
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<Paper elevation={4} onDragOver={e => e.preventDefault()} onDrop={this.handleDrop.bind(this)}>
						<Typography type="headline" component="h3">
							Drag &amp; drop
						</Typography>
						<Typography component="p">
							Drop some valid xml here.
						</Typography>
					</Paper>
				</Grid>
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
					<Button fab color="primary" aria-label="add" onClick={this.handleSubmit.bind(this)}>
						<AddIcon />
					</Button>
				</Grid>
			</Grid>
		);
	}
}
