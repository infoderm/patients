import React, {Suspense, lazy} from 'react';
import {Switch, Route, useParams} from 'react-router-dom';

import startOfDay from 'date-fns/startOfDay';
import dateParseISO from 'date-fns/parseISO';

import Greetings from './navigation/Greetings';
import NoMatch from './navigation/NoMatch';
import Loading from './navigation/Loading';

const FullTextSearchResults = lazy(
	async () => import('./search/FullTextSearchResults'),
);

const PatientRecordRoute = lazy(
	async () => import('./patients/PatientRecordRoute'),
);
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

const MonthlyPlannerRoute = lazy(
	async () => import('./planner/MonthlyPlannerRoute'),
);
const WeeklyPlannerRoute = lazy(
	async () => import('./planner/WeeklyPlannerRoute'),
);

const CurrentMonthlyPlannerRoute = lazy(
	async () => import('./planner/CurrentMonthlyPlannerRoute'),
);
const CurrentWeeklyPlannerRoute = lazy(
	async () => import('./planner/CurrentWeeklyPlannerRoute'),
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

const ConsultationsOfTheDayRoute = () => {
	const {day} = useParams<{day: string}>();
	return <ConsultationsOfTheDay day={startOfDay(dateParseISO(day))} />;
};

export default function Router() {
	return (
		<Suspense fallback={<Loading />}>
			<Switch>
				<Route children={<Greetings />} exact path="/" />

				<Route
					children={<FullTextSearchResults />}
					exact
					path="/search/:query"
				/>
				<Route
					children={<FullTextSearchResults />}
					exact
					path="/search/:query/page/:page"
				/>

				<Route children={<PatientRecordRoute />} exact path="/patient/:id" />
				<Route
					children={<PatientRecordRoute />}
					exact
					path="/patient/:id/:tab"
				/>
				<Route
					children={<PatientRecordRoute />}
					exact
					path="/patient/:id/:tab/page/:page"
				/>
				<Route children={<NewPatientForm />} exact path="/new/patient" />

				<Route children={<DocumentsList />} exact path="/documents" />
				<Route
					children={<DocumentsList />}
					exact
					path="/documents/page/:page"
				/>
				<Route
					children={<DocumentsFromIdentifierList />}
					exact
					path="/documents/:identifier"
				/>
				<Route
					children={<DocumentsFromIdentifierList />}
					exact
					path="/documents/:identifier/page/:page"
				/>
				<Route children={<DocumentDetails />} exact path="/document/:id" />
				<Route
					children={<DocumentVersionsList />}
					exact
					path="/document/versions/:identifier/:reference"
				/>
				<Route
					children={<DocumentVersionsList />}
					exact
					path="/document/versions/:identifier/:reference/page/:page"
				/>

				<Route
					children={<ConsultationsOfTheDayRoute />}
					exact
					path="/calendar/day/:day"
				/>
				<Route
					children={<MonthlyPlannerRoute />}
					exact
					path="/calendar/month/:year/:month"
				/>
				<Route
					children={<CurrentMonthlyPlannerRoute />}
					exact
					path="/calendar/month/current"
				/>
				<Route
					children={<WeeklyPlannerRoute />}
					exact
					path="/calendar/week/:year/:week"
				/>
				<Route
					children={<CurrentWeeklyPlannerRoute />}
					exact
					path="/calendar/week/current"
				/>
				<Route
					children={<TodaysConsultations />}
					exact
					path="/consultations/today"
				/>
				<Route
					children={<LastDayOfConsultations />}
					exact
					path="/consultations/last"
				/>
				<Route
					children={<LastConsultation />}
					exact
					path="/consultation/last"
				/>
				<Route
					children={<ConsultationDetails />}
					exact
					path="/consultation/:id"
				/>
				<Route
					children={<EditConsultation />}
					exact
					path="/edit/consultation/:id"
				/>
				<Route
					children={<NewConsultation />}
					exact
					path="/new/consultation/for/:id"
				/>

				<Route
					children={<CurrentWeeklyPlannerRoute />}
					exact
					path="/new/appointment/for/:patientId"
				/>
				<Route
					children={<MonthlyPlannerRoute />}
					exact
					path="/new/appointment/for/:patientId/month/:year/:month"
				/>
				<Route
					children={<WeeklyPlannerRoute />}
					exact
					path="/new/appointment/for/:patientId/week/:year/:week"
				/>

				<Route children={<BooksList />} exact path="/books" />
				<Route children={<BooksList />} exact path="/books/page/:page" />
				<Route children={<BooksList />} exact path="/books/:year" />
				<Route children={<BooksList />} exact path="/books/:year/page/:page" />

				<Route children={<BookDetails />} exact path="/book/:year/:book" />
				<Route
					children={<BookDetails />}
					exact
					path="/book/:year/:book/page/:page"
				/>

				<Route children={<PaidConsultationsList />} exact path="/paid" />
				<Route children={<PaidConsultationsList />} exact path="/paid/:year" />
				<Route
					children={<PaidConsultationsList />}
					exact
					path="/paid/:year/page/:page"
				/>

				<Route
					children={<PaidConsultationsList />}
					exact
					path="/paid/:payment_method"
				/>
				<Route
					children={<PaidConsultationsList />}
					exact
					path="/paid/:payment_method/:year"
				/>
				<Route
					children={<PaidConsultationsList />}
					exact
					path="/paid/:payment_method/:year/page/:page"
				/>

				<Route children={<UnpaidConsultationsList />} exact path="/unpaid" />
				<Route
					children={<UnpaidConsultationsList />}
					exact
					path="/unpaid/:year"
				/>
				<Route
					children={<UnpaidConsultationsList />}
					exact
					path="/unpaid/:year/page/:page"
				/>

				<Route children={<Stats />} exact path="/stats" />
				<Route children={<SEPAPaymentDetails />} exact path="/sepa" />

				<Route children={<Issues />} exact path="/issues" />
				<Route children={<MergePatientsForm />} exact path="/merge" />

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

				<Route children={<DrugsSearch />} exact path="/drugs" />
				<Route children={<DrugDetails />} exact path="/drug/:id" />

				<Route children={<Settings />} exact path="/settings" />
				<Route children={<Authentication />} exact path="/auth" />

				<Route children={<NoMatch />} />
			</Switch>
		</Suspense>
	);
}
