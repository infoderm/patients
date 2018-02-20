import React from 'react' ;
import { Switch , Route , Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';

import PatientsList from './PatientsList.js';
import PatientDetails from './PatientDetails.js';
import NewPatientForm from './NewPatientForm.js';
import ConsultationsList from './ConsultationsList.js';
import ConsultationDetails from './ConsultationDetails.js';
import NewConsultationForm from './NewConsultationForm.js';
import DrugsTable from './DrugsTable.js';

const styles = theme => ({
	main: {
		backgroundColor: theme.palette.background.default,
		width: 'calc(100% - 240px)',
		padding: theme.spacing.unit * 3,
		height: 'calc(100% - 56px)',
		marginTop: 56,
		marginLeft: 240,
		[theme.breakpoints.up('sm')]: {
			height: 'calc(100% - 64px)',
			marginTop: 64,
		},
	},
	fab: {
		position: 'fixed',
		bottom: theme.spacing.unit * 3,
		right: theme.spacing.unit * 3,
	},
});

const NoMatch = ({ location }) => (
	<div>
		<Typography variant="headline">
			No match for <code>{location.pathname}</code>.
		</Typography>
		<Typography variant="subheading">
			Work in progress. Come back later.
		</Typography>
	</div>
);

class Main extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { classes, patients, currentUser } = this.props;

		return (
			<main className={classes.main}>
				<Switch>
					<Route exact path='/' render={
						(props) => {
							return (
								<PatientsList patients={patients}/>
							) ;
						}
					}/>

					<Route exact path="/patient/:id" component={PatientDetails}/>

					<Route exact path="/new/patient" render={
						(props) => {
							return (
								<div style={{ padding: 12 }}>
									<NewPatientForm/>
								</div>
							) ;
						}
					}/>

					<Route exact path="/consultation/:id" component={ConsultationDetails}/>

					<Route exact path="/drugs" component={DrugsTable}/>

					<Route exact path="/consultations" component={ConsultationsList}/>

					<Route exact path="/new/consultation/for/:id" component={NewConsultationForm}/>

					<Route component={NoMatch}/>

				</Switch>
			</main>
		);
}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Main) ;
