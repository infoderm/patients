import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import { withRouter } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField' ;

import DrugsTable from './DrugsTable.js' ;

import { Drugs } from '../../api/drugs.js';

const styles = theme => ({ });

class DrugSearch extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			query: '' ,
		} ;
	}

	handleChange = (selectedItem, downshiftState) => {
		if ( selectedItem ) {
			const { history } = this.props;
			history.push(`/drug/${selectedItem._id}`);
		}
	};

	render(){

		const { query } = this.state ;

		return (
			<div>
				<TextField autoFocus label="Query" value={query} onChange={e => this.setState({query: e.target.value})}/>
				<DrugsTable query={query}/>
			</div>
			);
	}
}

DrugSearch.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (DrugSearch) ;
