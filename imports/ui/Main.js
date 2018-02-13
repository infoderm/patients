import React from 'react' ;
import { Switch , Route , Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import DoneIcon from 'material-ui-icons/Done';

import NewPatientForm from './NewPatientForm.js';
import PatientsList from './PatientsList.js';
import PatientDetails from './PatientDetails.js';

const styles = theme => ({
	fab: {
		position: 'fixed',
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 2,
	},
});

class Main extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			creationMode: false,
		};
	}

	render(){

		return (
			<Switch>
				<Route exact path='/' render={
					(props) => {
						const { classes, patients, filterSex, currentUser } = this.props;

						return (
							<div>
								<PatientsList patients={patients} filterSex={filterSex}/>
								{ currentUser &&
									<Link to='/new'>
										<Button variant="fab" className={classes.fab} color='primary' onClick={e => this.setState({creationMode: true})}>
											<AddIcon />
										</Button>
									</Link>
								}
							</div>
						) ;
					}
				}/>

				<Route path='/patient/:id' component={PatientDetails}/>

				<Route path='/new' render={
					(props) => {
						const { classes } = this.props;

						return (
							<div style={{ padding: 12 }}>
								<NewPatientForm/>
								<Link to='/'>
									<Button variant="fab" className={classes.fab} color='secondary' onClick={e => this.setState({creationMode: false})}>
										<DoneIcon />
									</Button>
								</Link>
							</div>
						) ;
					}
				}/>

			</Switch>
		);
}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Main) ;
