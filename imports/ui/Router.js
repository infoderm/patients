import React from 'react' ;
import { Switch , Route } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import startOfDay from 'date-fns/start_of_day';
import dateParse from 'date-fns/parse';

import PatientsList from './patients/PatientsList.js';
import PatientRecord from './patients/PatientRecord.js';
import NewPatientForm from './patients/NewPatientForm.js';

import ConsultationsList from './consultations/ConsultationsList.js';
import ConsultationDetails from './consultations/ConsultationDetails.js';
import EditConsultationForm from './consultations/EditConsultationForm.js';
import NewConsultationForm from './consultations/NewConsultationForm.js';
import Calendar from './consultations/Calendar.js';

import ImportData from './data/ImportData.js';

import MonthlyPlanner from './planner/MonthlyPlanner.js';
import WeeklyPlanner from './planner/WeeklyPlanner.js';

import BooksList from './books/BooksList.js';
import BookDetails from './books/BookDetails.js';

import DocumentsList from './documents/DocumentsList.js';
import DocumentDetails from './documents/DocumentDetails.js';

import UnpaidConsultationsList from './consultations/UnpaidConsultationsList.js';
import Stats from './stats/Stats.js';
import Issues from './issues/Issues.js';
import MergePatientsForm from './merge/MergePatientsForm.js';

import DoctorsList from './doctors/DoctorsList.js';
import DoctorDetails from './doctors/DoctorDetails.js';

import InsurancesList from './insurances/InsurancesList.js';
import InsuranceDetails from './insurances/InsuranceDetails.js';

import AllergiesList from './allergies/AllergiesList.js';
import AllergyDetails from './allergies/AllergyDetails.js';

import DrugsSearch from './drugs/DrugsSearch.js';
import DrugDetails from './drugs/DrugDetails.js';

import Settings from './settings/Settings.js';

const styles = theme => ({
	main: {
		backgroundColor: theme.palette.background.default,
    	flexGrow: 1,
		//width: 'calc(100% - 240px)',
		padding: theme.spacing.unit * 3,
		height: 'calc(100% - 56px)',
		marginTop: 56,
		//marginLeft: 240,
		[theme.breakpoints.up('sm')]: {
			height: 'calc(100% - 64px)',
			marginTop: 64,
		},
	},
});

const NoMatch = ({ location }) => (
	<div>
		<Typography variant="h5">
			No match for <code>{location.pathname}</code>.
		</Typography>
		<Typography variant="subtitle1">
			Work in progress. Come back later.
		</Typography>
	</div>
);

const ConsultationsListFromMatch = ({ match }) => (
	<ConsultationsList day={startOfDay(dateParse(match.params.day))}/>
);


class Main extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { classes, patients, currentUser, history } = this.props;

		if (!currentUser) return (
			<main className={classes.main}>
				<Typography variant="h5">Please sign in</Typography>
			</main>
		) ;

		return (
			<main className={classes.main}>
				<Switch>
					<Route exact path="/" render={
						props => ( <PatientsList patients={patients}/> )
					}/>

					<Route exact path="/patients/page/:page" render={
						( { match } ) => (
							<PatientsList patients={patients} page={parseInt(match.params.page,10)}/>
						)
					}/>

					<Route exact path="/patient/:id" component={PatientRecord}/>
					<Route exact path="/new/patient" component={NewPatientForm}/>

					<Route exact path="/documents" component={DocumentsList}/>
					<Route exact path="/documents/page/:page" component={DocumentsList}/>
					<Route exact path="/document/:id" component={DocumentDetails}/>

					<Route exact path="/calendar" component={Calendar}/>
					<Route exact path="/calendar/:day" component={ConsultationsListFromMatch}/>
					<Route exact path="/calendar/month/:year/:month" render={
						props => <MonthlyPlanner {...props} history={history}/>
					}/>
					<Route exact path="/calendar/week/:year/:week" render={
						props => <WeeklyPlanner {...props} history={history}/>
					}/>
					<Route exact path="/consultations/:day" component={ConsultationsListFromMatch}/>
					<Route exact path="/consultation/:id" component={ConsultationDetails}/>
					<Route exact path="/edit/consultation/:id" component={EditConsultationForm}/>
					<Route exact path="/new/consultation/for/:id" component={NewConsultationForm}/>

					<Route exact path="/import" render={
						(props) => <ImportData {...props} history={history}/>
					}/>

					<Route exact path="/books" component={BooksList}/>
					<Route exact path="/books/page/:page" component={BooksList}/>
					<Route exact path="/book/:year/:book" component={BookDetails}/>
					<Route exact path="/book/:year/:book/page/:page" component={BookDetails}/>

					<Route exact path="/unpaid" component={UnpaidConsultationsList}/>
					<Route exact path="/stats" component={Stats}/>

					<Route exact path="/issues" component={Issues}/>
					<Route exact path="/merge" render={
						props => ( <MergePatientsForm patients={patients}/> )
					}/>

					<Route exact path="/doctors" component={DoctorsList}/>
					<Route exact path="/doctors/page/:page" component={DoctorsList}/>
					<Route exact path="/doctor/:name" component={DoctorDetails}/>
					<Route exact path="/doctor/:name/page/:page" component={DoctorDetails}/>

					<Route exact path="/insurances" component={InsurancesList}/>
					<Route exact path="/insurances/page/:page" component={InsurancesList}/>
					<Route exact path="/insurance/:name" component={InsuranceDetails}/>
					<Route exact path="/insurance/:name/page/:page" component={InsuranceDetails}/>

					<Route exact path="/allergies" component={AllergiesList}/>
					<Route exact path="/allergies/page/:page" component={AllergiesList}/>
					<Route exact path="/allergy/:name" component={AllergyDetails}/>
					<Route exact path="/allergy/:name/page/:page" component={AllergyDetails}/>

					<Route exact path="/drugs" component={DrugsSearch}/>
					<Route exact path="/drug/:id" component={DrugDetails}/>

					<Route exact path="/settings" component={Settings}/>

					<Route component={NoMatch}/>

				</Switch>
			</main>
		);
}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Main) ;
