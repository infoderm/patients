import React from 'react' ;
import { withRouter } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SearchBox from './patients/SearchBox.js';
import AccountsUIWrapper from './users/AccountsUIWrapper.js';
import AccountsUI from './users/AccountsUI.js';

const drawerWidth = 240;

const styles = theme => ({
	appBar: {
		position: 'fixed',
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
	},
	title: {
		flex: '0 1 auto',
		marginLeft: theme.spacing.unit * 3,
	},
});

function getSuggestions(suggestions, inputValue) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep = count < 5 && (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase()));

    if (keep) ++count;

    return keep;
  });
}

class Header extends React.Component {

	constructor(props){
		super(props);
	}

	handleChange = (selectedItem, downshiftState) => {
		if ( selectedItem ) {
			const { history } = this.props;
			history.push(`/patient/${selectedItem._id}`);
		}
	};

	render(){

		const { classes, patients, currentUser } = this.props;

		const suggestions = patients.map(
			patient => ({
				label : `${patient.lastname} ${patient.firstname}` ,
				_id : patient._id ,
			})
		) ;

		return (
			<AppBar className={classes.appBar}>
				<Toolbar>
					<Typography variant="title" color="inherit" className={classes.title}>{location.pathname}</Typography>
					<div style={{flex:'1 1 auto'}}></div>
					<SearchBox filter={getSuggestions} suggestions={suggestions} itemToString={item => item ? item.label : ''} onChange={this.handleChange}/>
					<AccountsUI currentUser={currentUser}/>
				</Toolbar>
			</AppBar>
			);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default withRouter( withStyles(styles, { withTheme: true }) (Header) ) ;
