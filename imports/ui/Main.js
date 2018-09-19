import React from 'react' ;
import { Switch , Route , Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import startOfDay from 'date-fns/start_of_day'
import parse from 'date-fns/parse'

import PatientsList from './PatientsList.js';
import DoctorsList from './doctors/DoctorsList.js';
import PatientDetails from './PatientDetails.js';
import NewPatientForm from './NewPatientForm.js';
import ConsultationsList from './ConsultationsList.js';
import UnpaidConsultationsList from './UnpaidConsultationsList.js';
import ConsultationDetails from './ConsultationDetails.js';
import EditConsultationForm from './EditConsultationForm.js';
import NewConsultationForm from './NewConsultationForm.js';
import DrugsSearch from './DrugsSearch.js';
import DrugDetails from './DrugDetails.js';
import Calendar from './Calendar.js';
import Stats from './Stats.js';
import Issues from './Issues.js';

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

const ConsultationsListFromMatch = ({ match }) => (
	<ConsultationsList day={startOfDay(parse(match.params.day))}/>
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
						props => {
							return (
								<PatientsList patients={patients} page={0} perpage={10}/>
							) ;
						}
					}/>

					<Route exact path='/patients/page/:page' render={
						( { match } ) => {
							return (
								<PatientsList patients={patients} page={parseInt(match.params.page,10)} perpage={10}/>
							) ;
						}
					}/>

					<Route exact path='/doctors' render={
						( { match } ) => {
							return (
								<DoctorsList page={0} perpage={10}/>
							) ;
						}
					}/>

					<Route exact path='/doctors/page/:page' render={
						( { match } ) => {
							return (
								<DoctorsList page={parseInt(match.params.page,10)} perpage={10}/>
							) ;
						}
					}/>

					<Route exact path="/patient/:id" component={PatientDetails}/>

					<Route exact path="/new/patient" component={NewPatientForm}/>

					<Route exact path="/drugs" component={DrugsSearch}/>

					<Route exact path="/drug/:id" component={DrugDetails}/>

					<Route exact path="/consultation/:id" component={ConsultationDetails}/>

					<Route exact path="/edit/consultation/:id" component={EditConsultationForm}/>

					<Route exact path="/new/consultation/for/:id" component={NewConsultationForm}/>

					<Route exact path="/calendar" component={Calendar}/>

					<Route exact path="/calendar/:day" component={ConsultationsListFromMatch}/>

					<Route exact path="/stats" component={Stats}/>

					<Route exact path="/unpaid" component={UnpaidConsultationsList}/>

					<Route exact path="/issues" component={Issues}/>

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
