import React from 'react' ;

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'

import { Patients } from '../api/patients.js';

import Filter from './Filter.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

const styles = theme => ({
	filterSex: {
		marginLeft: "2rem",
	},
});

class Header extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			filterSex: 'all',
		};
	}

	render(){

		const { classes, patients } = this.props;

		const suggestions = patients.map(
			patient => ({
				label : `${patient.firstname} ${patient.lastname}` ,
			})
		) ;

		return (
			<AppBar position="sticky">
				<Toolbar>
					<Typography type="title" color="inherit" style={{flex:1}}>Patients</Typography>
					<AccountsUIWrapper/>
					<Select
						className={classes.filterSex}
						label="Filter by sex"
						value={this.state.filterSex}
						onChange={e => this.setState({ filterSex: e.target.value })}
					>
						<MenuItem value="all">All</MenuItem>
						<MenuItem value="female">Only female</MenuItem>
						<MenuItem value="male">Only male</MenuItem>
						<MenuItem value="other">Only other</MenuItem>
					</Select>
					<Filter suggestions={suggestions}/>
				</Toolbar>
			</AppBar>
			);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Header) ;
