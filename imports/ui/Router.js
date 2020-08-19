import React from 'react' ;
import { Switch , Route } from 'react-router-dom';

import startOfDay from 'date-fns/startOfDay';
import startOfToday from 'date-fns/startOfToday' ;
import dateParseISO from 'date-fns/parseISO';
import dateFormat from 'date-fns/format' ;

import NoContent from './navigation/NoContent.js';
import NoMatch from './navigation/NoMatch.js';

import PatientsList from './patients/PatientsList.js';
import PatientRecord from './patients/PatientRecord.js';
import NewPatientForm from './patients/NewPatientForm.js';

import ConsultationsOfTheDay from './consultations/ConsultationsOfTheDay.js';
import LastDayOfConsultations from './consultations/LastDayOfConsultations.js';
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
import DocumentVersionsList from './documents/DocumentVersionsList.js';
import DocumentDetails from './documents/DocumentDetails.js';

import WiredConsultationsList from './consultations/WiredConsultationsList.js';
import ThirdPartyConsultationsList from './consultations/ThirdPartyConsultationsList.js';
import SEPAPaymentDetails from './payment/SEPAPaymentDetails.js';
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

const ConsultationsOfTheDayFromMatch = ({ match }) => (
	<ConsultationsOfTheDay day={startOfDay(dateParseISO(match.params.day))}/>
);

const CurrentMonthlyPlanner = props => {
	const today = startOfToday();
	const year = dateFormat(today, 'yyyy');
	const month = dateFormat(today, 'MM');
	const match = {
		params: {
			year,
			month,
		},
	};
	return (
		<MonthlyPlanner match={match} {...props}/>
	) ;
}

export default function Router ( ) {

	return (
		<Switch>
			<Route exact path="/" render={
				props => ( <NoContent>Bonjour maman!</NoContent> )
			}/>

			<Route exact path="/patients/page/:page" render={
				( { match } ) => (
					<PatientsList page={parseInt(match.params.page,10)}/>
				)
			}/>

			<Route exact path="/patient/:id" component={PatientRecord}/>
			<Route exact path="/patient/:id/:tab" component={PatientRecord}/>
			<Route exact path="/patient/:id/:tab/page/:page" component={PatientRecord}/>
			<Route exact path="/new/patient" component={NewPatientForm}/>

			<Route exact path="/documents" component={DocumentsList}/>
			<Route exact path="/documents/page/:page" component={DocumentsList}/>
			<Route exact path="/document/:id" component={DocumentDetails}/>
			<Route exact path="/document/versions/:identifier/:reference" component={DocumentVersionsList}/>
			<Route exact path="/document/versions/:identifier/:reference/page/:page" component={DocumentVersionsList}/>

			<Route exact path="/calendar" component={Calendar}/>
			<Route exact path="/calendar/:day" component={ConsultationsOfTheDayFromMatch}/>
			<Route exact path="/calendar/month/:year/:month" render={
				props => <MonthlyPlanner {...props}/>
			}/>
			<Route exact path="/calendar/month/current" render={
				props => <CurrentMonthlyPlanner/>
			}/>
			<Route exact path="/calendar/week/:year/:week" render={
				props => <WeeklyPlanner {...props}/>
			}/>
			<Route exact path="/consultations" component={LastDayOfConsultations}/>
			<Route exact path="/consultation/:id" component={ConsultationDetails}/>
			<Route exact path="/edit/consultation/:id" component={EditConsultationForm}/>
			<Route exact path="/new/consultation/for/:id" component={NewConsultationForm}/>

			<Route exact path="/import" render={
				(props) => <ImportData {...props}/>
			}/>

			<Route exact path="/books" component={BooksList}/>
			<Route exact path="/books/page/:page" component={BooksList}/>
			<Route exact path="/books/:year" component={BooksList}/>
			<Route exact path="/books/:year/page/:page" component={BooksList}/>

			<Route exact path="/book/:year/:book" component={BookDetails}/>
			<Route exact path="/book/:year/:book/page/:page" component={BookDetails}/>

			<Route exact path="/wires" component={WiredConsultationsList}/>
			<Route exact path="/wires/:year" component={WiredConsultationsList}/>
			<Route exact path="/wires/:year/page/:page" component={WiredConsultationsList}/>

			<Route exact path="/third-party" component={ThirdPartyConsultationsList}/>
			<Route exact path="/third-party/:year" component={ThirdPartyConsultationsList}/>
			<Route exact path="/third-party/:year/page/:page" component={ThirdPartyConsultationsList}/>

			<Route exact path="/unpaid" component={UnpaidConsultationsList}/>
			<Route exact path="/stats" component={Stats}/>
			<Route exact path="/sepa" component={SEPAPaymentDetails}/>

			<Route exact path="/issues" component={Issues}/>
			<Route exact path="/merge" component={MergePatientsForm}/>

			<Route exact path="/doctors" component={DoctorsList}/>
			<Route exact path="/doctors/page/:page" component={DoctorsList}/>
			<Route exact path="/doctors/:prefix" component={DoctorsList}/>
			<Route exact path="/doctors/:prefix/page/:page" component={DoctorsList}/>

			<Route exact path="/doctor/:name" component={DoctorDetails}/>
			<Route exact path="/doctor/:name/page/:page" component={DoctorDetails}/>

			<Route exact path="/insurances" component={InsurancesList}/>
			<Route exact path="/insurances/page/:page" component={InsurancesList}/>
			<Route exact path="/insurances/:prefix" component={InsurancesList}/>
			<Route exact path="/insurances/:prefix/page/:page" component={InsurancesList}/>

			<Route exact path="/insurance/:name" component={InsuranceDetails}/>
			<Route exact path="/insurance/:name/page/:page" component={InsuranceDetails}/>

			<Route exact path="/allergies" component={AllergiesList}/>
			<Route exact path="/allergies/page/:page" component={AllergiesList}/>
			<Route exact path="/allergies/:prefix" component={AllergiesList}/>
			<Route exact path="/allergies/:prefix/page/:page" component={AllergiesList}/>

			<Route exact path="/allergy/:name" component={AllergyDetails}/>
			<Route exact path="/allergy/:name/page/:page" component={AllergyDetails}/>

			<Route exact path="/drugs" component={DrugsSearch}/>
			<Route exact path="/drug/:id" component={DrugDetails}/>

			<Route exact path="/settings" component={Settings}/>

			<Route component={NoMatch}/>

		</Switch>
	);
}
