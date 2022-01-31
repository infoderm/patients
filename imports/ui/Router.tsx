import React, {Suspense, lazy} from 'react';
import {Switch, Route} from 'react-router-dom';

import startOfDay from 'date-fns/startOfDay';
import startOfToday from 'date-fns/startOfToday';
import dateParseISO from 'date-fns/parseISO';

import {useDateFormat} from '../i18n/datetime';

import Greetings from './navigation/Greetings';
import NoMatch from './navigation/NoMatch';
import Loading from './navigation/Loading';

const FullTextSearchResults = lazy(
	async () => import('./search/FullTextSearchResults'),
);

const PatientRecord = lazy(async () => import('./patients/PatientRecord'));
const NewPatientForm = lazy(async () => import('./patients/NewPatientForm'));

const ConsultationsOfTheDay = lazy(
	async () => import('./consultations/ConsultationsOfTheDay'),
);
const TodaysConsultations = lazy(
	async () => import('./consultations/TodaysConsultations'),
);
const LastDayOfConsultations = lazy(
	async () => import('./consultations/LastDayOfConsultations'),
);
const LastConsultation = lazy(
	async () => import('./consultations/LastConsultation'),
);
const ConsultationDetails = lazy(
	async () => import('./consultations/ConsultationDetails'),
);
const EditConsultation = lazy(
	async () => import('./consultations/EditConsultation'),
);
const NewConsultation = lazy(
	async () => import('./consultations/NewConsultation'),
);

const MonthlyPlanner = lazy(
	async () => import('./planner/PreconfiguredMonthlyPlanner'),
);
const WeeklyPlanner = lazy(
	async () => import('./planner/PreconfiguredWeeklyPlanner'),
);

const BooksList = lazy(async () => import('./books/BooksList'));
const BookDetails = lazy(async () => import('./books/BookDetails'));

const DocumentsList = lazy(async () => import('./documents/DocumentsList'));
const DocumentVersionsList = lazy(
	async () => import('./documents/DocumentVersionsList'),
);
const DocumentsFromIdentifierList = lazy(
	async () => import('./documents/DocumentsFromIdentifierList'),
);
const DocumentDetails = lazy(async () => import('./documents/DocumentDetails'));

const PaidConsultationsList = lazy(
	async () => import('./consultations/PaidConsultationsList'),
);
const SEPAPaymentDetails = lazy(
	async () => import('./payment/SEPAPaymentDetails'),
);
const UnpaidConsultationsList = lazy(
	async () => import('./consultations/UnpaidConsultationsList'),
);
const Stats = lazy(async () => import('./stats/Stats'));
const Issues = lazy(async () => import('./issues/Issues'));
const MergePatientsForm = lazy(async () => import('./merge/MergePatientsForm'));

const DoctorsList = lazy(async () => import('./doctors/DoctorsList'));
const DoctorDetails = lazy(async () => import('./doctors/DoctorDetails'));

const InsurancesList = lazy(async () => import('./insurances/InsurancesList'));
const InsuranceDetails = lazy(
	async () => import('./insurances/InsuranceDetails'),
);

const AllergiesList = lazy(async () => import('./allergies/AllergiesList'));
const AllergyDetails = lazy(async () => import('./allergies/AllergyDetails'));

const DrugsSearch = lazy(async () => import('./drugs/DrugsSearch'));
const DrugDetails = lazy(async () => import('./drugs/DrugDetails'));

const Settings = lazy(async () => import('./settings/Settings'));
const Authentication = lazy(async () => import('./auth/Authentication'));

const ConsultationsOfTheDayFromMatch = ({match}) => (
	<ConsultationsOfTheDay day={startOfDay(dateParseISO(match.params.day))} />
);

const CurrentMonthlyPlanner = ({match, ...rest}) => {
	const dateFormat = useDateFormat();
	const today = startOfToday();
	const year = dateFormat(today, 'yyyy');
	const month = dateFormat(today, 'MM');
	const matchWithParams = {
		...match,
		params: {
			...match?.params,
			year,
			month,
		},
	};
	return <MonthlyPlanner match={matchWithParams} {...rest} />;
};

const CurrentWeeklyPlanner = ({match, ...rest}) => {
	const dateFormat = useDateFormat();
	const today = startOfToday();
	const year = dateFormat(today, 'YYYY', {
		useAdditionalWeekYearTokens: true,
	});
	const week = dateFormat(today, 'ww');
	const matchWithParams = {
		...match,
		params: {
			...match?.params,
			year,
			week,
		},
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
				<Route
					exact
					path="/consultations/today"
					component={TodaysConsultations}
				/>
				<Route
					exact
					path="/consultations/last"
					component={LastDayOfConsultations}
				/>
				<Route exact path="/consultation/last" component={LastConsultation} />
				<Route exact path="/consultation/:id" component={ConsultationDetails} />
				<Route
					exact
					path="/edit/consultation/:id"
					component={EditConsultation}
				/>
				<Route
					exact
					path="/new/consultation/for/:id"
					component={NewConsultation}
				/>

				<Route
					exact
					path="/new/appointment/for/:patientId"
					component={CurrentWeeklyPlanner}
				/>
				<Route
					exact
					path="/new/appointment/for/:patientId/month/:year/:month"
					component={MonthlyPlanner}
				/>
				<Route
					exact
					path="/new/appointment/for/:patientId/week/:year/:week"
					component={WeeklyPlanner}
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

				<Route exact path="/paid" component={PaidConsultationsList} />
				<Route exact path="/paid/:year" component={PaidConsultationsList} />
				<Route
					exact
					path="/paid/:year/page/:page"
					component={PaidConsultationsList}
				/>

				<Route
					exact
					path="/paid/:payment_method"
					component={PaidConsultationsList}
				/>
				<Route
					exact
					path="/paid/:payment_method/:year"
					component={PaidConsultationsList}
				/>
				<Route
					exact
					path="/paid/:payment_method/:year/page/:page"
					component={PaidConsultationsList}
				/>

				<Route exact path="/unpaid" component={UnpaidConsultationsList} />
				<Route exact path="/unpaid/:year" component={UnpaidConsultationsList} />
				<Route
					exact
					path="/unpaid/:year/page/:page"
					component={UnpaidConsultationsList}
				/>

				<Route children={<Stats />} exact path="/stats" />
				<Route children={<SEPAPaymentDetails />} exact path="/sepa" />

				<Route exact path="/issues" component={Issues} />
				<Route exact path="/merge" component={MergePatientsForm} />

				<Route children={<DoctorsList />} exact path="/doctors" />
				<Route children={<DoctorsList />} exact path="/doctors/page/:page" />
				<Route children={<DoctorsList />} exact path="/doctors/:prefix" />
				<Route
					children={<DoctorsList />}
					exact
					path="/doctors/:prefix/page/:page"
				/>

				<Route children={<DoctorDetails />} exact path="/doctor/:name" />
				<Route
					children={<DoctorDetails />}
					exact
					path="/doctor/:name/page/:page"
				/>

				<Route children={<InsurancesList />} exact path="/insurances" />
				<Route
					children={<InsurancesList />}
					exact
					path="/insurances/page/:page"
				/>
				<Route children={<InsurancesList />} exact path="/insurances/:prefix" />
				<Route
					children={<InsurancesList />}
					exact
					path="/insurances/:prefix/page/:page"
				/>

				<Route children={<InsuranceDetails />} exact path="/insurance/:name" />
				<Route
					children={<InsuranceDetails />}
					exact
					path="/insurance/:name/page/:page"
				/>

				<Route children={<AllergiesList />} exact path="/allergies" />
				<Route
					children={<AllergiesList />}
					exact
					path="/allergies/page/:page"
				/>
				<Route children={<AllergiesList />} exact path="/allergies/:prefix" />
				<Route
					children={<AllergiesList />}
					exact
					path="/allergies/:prefix/page/:page"
				/>

				<Route children={<AllergyDetails />} exact path="/allergy/:name" />
				<Route
					children={<AllergyDetails />}
					exact
					path="/allergy/:name/page/:page"
				/>

				<Route exact path="/drugs" component={DrugsSearch} />
				<Route exact path="/drug/:id" component={DrugDetails} />

				<Route exact path="/settings" component={Settings} />
				<Route exact path="/auth" component={Authentication} />

				<Route component={NoMatch} />
			</Switch>
		</Suspense>
	);
}
