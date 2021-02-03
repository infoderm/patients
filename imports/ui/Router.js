import React, {Suspense, lazy} from 'react';
import {Switch, Route} from 'react-router-dom';

import startOfDay from 'date-fns/startOfDay';
import startOfToday from 'date-fns/startOfToday';
import dateParseISO from 'date-fns/parseISO';
import dateFormat from 'date-fns/format';

import Greetings from './navigation/Greetings.js';
import NoMatch from './navigation/NoMatch.js';
import Loading from './navigation/Loading.js';

const FullTextSearchResults = lazy(() =>
	import('./search/FullTextSearchResults')
);

const PatientRecord = lazy(() => import('./patients/PatientRecord.js'));
const NewPatientForm = lazy(() => import('./patients/NewPatientForm.js'));

const ConsultationsOfTheDay = lazy(() =>
	import('./consultations/ConsultationsOfTheDay.js')
);
const LastDayOfConsultations = lazy(() =>
	import('./consultations/LastDayOfConsultations.js')
);
const ConsultationDetails = lazy(() =>
	import('./consultations/ConsultationDetails.js')
);
const EditConsultationForm = lazy(() =>
	import('./consultations/EditConsultationForm.js')
);
const NewConsultationForm = lazy(() =>
	import('./consultations/NewConsultationForm.js')
);

const ImportData = lazy(() => import('./data/ImportData.js'));

const MonthlyPlanner = lazy(() => import('./planner/MonthlyPlanner.js'));
const WeeklyPlanner = lazy(() => import('./planner/WeeklyPlanner.js'));

const BooksList = lazy(() => import('./books/BooksList.js'));
const BookDetails = lazy(() => import('./books/BookDetails.js'));

const DocumentsList = lazy(() => import('./documents/DocumentsList.js'));
const DocumentVersionsList = lazy(() =>
	import('./documents/DocumentVersionsList.js')
);
const DocumentsFromIdentifierList = lazy(() =>
	import('./documents/DocumentsFromIdentifierList.js')
);
const DocumentDetails = lazy(() => import('./documents/DocumentDetails.js'));

const WiredConsultationsList = lazy(() =>
	import('./consultations/WiredConsultationsList.js')
);
const ThirdPartyConsultationsList = lazy(() =>
	import('./consultations/ThirdPartyConsultationsList.js')
);
const SEPAPaymentDetails = lazy(() =>
	import('./payment/SEPAPaymentDetails.js')
);
const UnpaidConsultationsList = lazy(() =>
	import('./consultations/UnpaidConsultationsList.js')
);
const Stats = lazy(() => import('./stats/Stats.js'));
const Issues = lazy(() => import('./issues/Issues.js'));
const MergePatientsForm = lazy(() => import('./merge/MergePatientsForm.js'));

const DoctorsList = lazy(() => import('./doctors/DoctorsList.js'));
const DoctorDetails = lazy(() => import('./doctors/DoctorDetails.js'));

const InsurancesList = lazy(() => import('./insurances/InsurancesList.js'));
const InsuranceDetails = lazy(() => import('./insurances/InsuranceDetails.js'));

const AllergiesList = lazy(() => import('./allergies/AllergiesList.js'));
const AllergyDetails = lazy(() => import('./allergies/AllergyDetails.js'));

const DrugsSearch = lazy(() => import('./drugs/DrugsSearch.js'));
const DrugDetails = lazy(() => import('./drugs/DrugDetails.js'));

const Settings = lazy(() => import('./settings/Settings.js'));

const ConsultationsOfTheDayFromMatch = ({match}) => (
	<ConsultationsOfTheDay day={startOfDay(dateParseISO(match.params.day))} />
);

const CurrentMonthlyPlanner = ({match, ...rest}) => {
	const today = startOfToday();
	const year = dateFormat(today, 'yyyy');
	const month = dateFormat(today, 'MM');
	const matchWithParams = {
		...match,
		params: {
			year,
			month
		}
	};
	return <MonthlyPlanner match={matchWithParams} {...rest} />;
};

const CurrentWeeklyPlanner = ({match, ...rest}) => {
	const today = startOfToday();
	const year = dateFormat(today, 'yyyy');
	const week = dateFormat(today, 'ww');
	const matchWithParams = {
		...match,
		params: {
			year,
			week
		}
	};
	return <WeeklyPlanner match={matchWithParams} {...rest} />;
};

export default function Router() {
	return (
		<Suspense fallback={<Loading />}>
			<Switch>
				<Route exact path="/" component={Greetings} />

				<Route exact path="/search/:query" component={FullTextSearchResults} />
				<Route
					exact
					path="/search/:query/page/:page"
					component={FullTextSearchResults}
				/>

				<Route exact path="/patient/:id" component={PatientRecord} />
				<Route exact path="/patient/:id/:tab" component={PatientRecord} />
				<Route
					exact
					path="/patient/:id/:tab/page/:page"
					component={PatientRecord}
				/>
				<Route exact path="/new/patient" component={NewPatientForm} />

				<Route exact path="/documents" component={DocumentsList} />
				<Route exact path="/documents/page/:page" component={DocumentsList} />
				<Route
					exact
					path="/documents/:identifier"
					component={DocumentsFromIdentifierList}
				/>
				<Route
					exact
					path="/documents/:identifier/page/:page"
					component={DocumentsFromIdentifierList}
				/>
				<Route exact path="/document/:id" component={DocumentDetails} />
				<Route
					exact
					path="/document/versions/:identifier/:reference"
					component={DocumentVersionsList}
				/>
				<Route
					exact
					path="/document/versions/:identifier/:reference/page/:page"
					component={DocumentVersionsList}
				/>

				<Route
					exact
					path="/calendar/day/:day"
					component={ConsultationsOfTheDayFromMatch}
				/>
				<Route
					exact
					path="/calendar/month/:year/:month"
					component={MonthlyPlanner}
				/>
				<Route
					exact
					path="/calendar/month/current"
					component={CurrentMonthlyPlanner}
				/>
				<Route
					exact
					path="/calendar/week/:year/:week"
					component={WeeklyPlanner}
				/>
				<Route
					exact
					path="/calendar/week/current"
					component={CurrentWeeklyPlanner}
				/>
				<Route exact path="/consultations" component={LastDayOfConsultations} />
				<Route exact path="/consultation/:id" component={ConsultationDetails} />
				<Route
					exact
					path="/edit/consultation/:id"
					component={EditConsultationForm}
				/>
				<Route
					exact
					path="/new/consultation/for/:id"
					component={NewConsultationForm}
				/>

				<Route
					exact
					path="/import"
					render={(props) => <ImportData {...props} />}
				/>

				<Route exact path="/books" component={BooksList} />
				<Route exact path="/books/page/:page" component={BooksList} />
				<Route exact path="/books/:year" component={BooksList} />
				<Route exact path="/books/:year/page/:page" component={BooksList} />

				<Route exact path="/book/:year/:book" component={BookDetails} />
				<Route
					exact
					path="/book/:year/:book/page/:page"
					component={BookDetails}
				/>

				<Route exact path="/wires" component={WiredConsultationsList} />
				<Route exact path="/wires/:year" component={WiredConsultationsList} />
				<Route
					exact
					path="/wires/:year/page/:page"
					component={WiredConsultationsList}
				/>

				<Route
					exact
					path="/third-party"
					component={ThirdPartyConsultationsList}
				/>
				<Route
					exact
					path="/third-party/:year"
					component={ThirdPartyConsultationsList}
				/>
				<Route
					exact
					path="/third-party/:year/page/:page"
					component={ThirdPartyConsultationsList}
				/>

				<Route exact path="/unpaid" component={UnpaidConsultationsList} />
				<Route exact path="/stats" component={Stats} />
				<Route exact path="/sepa" component={SEPAPaymentDetails} />

				<Route exact path="/issues" component={Issues} />
				<Route exact path="/merge" component={MergePatientsForm} />

				<Route exact path="/doctors" component={DoctorsList} />
				<Route exact path="/doctors/page/:page" component={DoctorsList} />
				<Route exact path="/doctors/:prefix" component={DoctorsList} />
				<Route
					exact
					path="/doctors/:prefix/page/:page"
					component={DoctorsList}
				/>

				<Route exact path="/doctor/:name" component={DoctorDetails} />
				<Route
					exact
					path="/doctor/:name/page/:page"
					component={DoctorDetails}
				/>

				<Route exact path="/insurances" component={InsurancesList} />
				<Route exact path="/insurances/page/:page" component={InsurancesList} />
				<Route exact path="/insurances/:prefix" component={InsurancesList} />
				<Route
					exact
					path="/insurances/:prefix/page/:page"
					component={InsurancesList}
				/>

				<Route exact path="/insurance/:name" component={InsuranceDetails} />
				<Route
					exact
					path="/insurance/:name/page/:page"
					component={InsuranceDetails}
				/>

				<Route exact path="/allergies" component={AllergiesList} />
				<Route exact path="/allergies/page/:page" component={AllergiesList} />
				<Route exact path="/allergies/:prefix" component={AllergiesList} />
				<Route
					exact
					path="/allergies/:prefix/page/:page"
					component={AllergiesList}
				/>

				<Route exact path="/allergy/:name" component={AllergyDetails} />
				<Route
					exact
					path="/allergy/:name/page/:page"
					component={AllergyDetails}
				/>

				<Route exact path="/drugs" component={DrugsSearch} />
				<Route exact path="/drug/:id" component={DrugDetails} />

				<Route exact path="/settings" component={Settings} />

				<Route component={NoMatch} />
			</Switch>
		</Suspense>
	);
}
