import React, {Suspense, lazy, useMemo} from 'react';
import {Routes, Route, useParams} from 'react-router-dom';

import startOfDay from 'date-fns/startOfDay';
import dateParseISO from 'date-fns/parseISO';

import Greetings from './navigation/Greetings';
import NoMatch from './navigation/NoMatch';
import Loading from './navigation/Loading';

const FullTextSearchResultsRoutes = lazy(
	async () => import('./search/FullTextSearchResultsRoutes'),
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

const MonthlyPlannerRoutes = lazy(
	async () => import('./planner/MonthlyPlannerRoutes'),
);
const WeeklyPlannerRoutes = lazy(
	async () => import('./planner/WeeklyPlannerRoutes'),
);

const BooksListRoutes = lazy(async () => import('./books/BooksListRoutes'));
const BookDetailsRoutes = lazy(async () => import('./books/BookDetailsRoutes'));

const DocumentsListRoutes = lazy(
	async () => import('./documents/DocumentsListRoutes'),
);
const DocumentVersionsListRoutes = lazy(
	async () => import('./documents/DocumentVersionsListRoutes'),
);
const DocumentsFromIdentifierListRoutes = lazy(
	async () => import('./documents/DocumentsFromIdentifierListRoutes'),
);
const DocumentDetails = lazy(async () => import('./documents/DocumentDetails'));

const PaidConsultationsListRoutes = lazy(
	async () => import('./consultations/PaidConsultationsListRoutes'),
);
const SEPAPaymentDetails = lazy(
	async () => import('./payment/SEPAPaymentDetails'),
);
const UnpaidConsultationsListRoutes = lazy(
	async () => import('./consultations/UnpaidConsultationsListRoutes'),
);
const Stats = lazy(async () => import('./stats/Stats'));
const Issues = lazy(async () => import('./issues/Issues'));
const MergePatientsForm = lazy(async () => import('./merge/MergePatientsForm'));

const DoctorsListRoutes = lazy(
	async () => import('./doctors/DoctorsListRoutes'),
);
const DoctorDetailsRoutes = lazy(
	async () => import('./doctors/DoctorDetailsRoutes'),
);

const InsurancesListRoutes = lazy(
	async () => import('./insurances/InsurancesListRoutes'),
);
const InsuranceDetailsRoutes = lazy(
	async () => import('./insurances/InsuranceDetailsRoutes'),
);

const AllergiesListRoutes = lazy(
	async () => import('./allergies/AllergiesListRoutes'),
);
const AllergyDetailsRoutes = lazy(
	async () => import('./allergies/AllergyDetailsRoutes'),
);

const DrugsSearch = lazy(async () => import('./drugs/DrugsSearch'));
const DrugDetails = lazy(async () => import('./drugs/DrugDetails'));

const Settings = lazy(async () => import('./settings/Settings'));
const Authentication = lazy(async () => import('./auth/Authentication'));

const ConsultationsOfTheDayRoute = () => {
	const {day: dayString} = useParams<{day: string}>();
	const day = useMemo(() => startOfDay(dateParseISO(dayString)), [dayString]);
	return <ConsultationsOfTheDay day={day} />;
};

export default function Router() {
	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				<Route element={<Greetings />} path="/" />

				<Route
					element={<FullTextSearchResultsRoutes />}
					path="search/:query/*"
				/>

				<Route element={<PatientRecordRoute />} path="patient/:id/*" />
				<Route element={<NewPatientForm />} path="new/patient" />

				<Route element={<DocumentsListRoutes />} path="documents/*" />
				<Route
					element={<DocumentsFromIdentifierListRoutes />}
					path="documents/filterBy/identifier/:identifier/*"
				/>
				<Route element={<DocumentDetails />} path="document/:id" />
				<Route
					element={<DocumentVersionsListRoutes />}
					path="document/versions/:identifier/:reference/*"
				/>

				<Route path="calendar">
					<Route element={<ConsultationsOfTheDayRoute />} path="day/:day" />
					<Route element={<MonthlyPlannerRoutes />} path="month/*" />
					<Route element={<WeeklyPlannerRoutes />} path="week/*" />
				</Route>
				<Route element={<TodaysConsultations />} path="consultations/today" />
				<Route element={<LastDayOfConsultations />} path="consultations/last" />
				<Route element={<LastConsultation />} path="consultation/last" />
				<Route element={<ConsultationDetails />} path="consultation/:id" />
				<Route element={<EditConsultation />} path="edit/consultation/:id" />
				<Route element={<NewConsultation />} path="new/consultation/for/:id" />

				<Route path="new/appointment/for/:patientId">
					<Route element={<MonthlyPlannerRoutes />} path="month/*" />
					<Route element={<WeeklyPlannerRoutes />} path="week/*" />
				</Route>

				<Route element={<BooksListRoutes />} path="books/*" />
				<Route element={<BookDetailsRoutes />} path="book/*" />

				<Route element={<PaidConsultationsListRoutes />} path="paid/*" />
				<Route element={<UnpaidConsultationsListRoutes />} path="unpaid/*" />

				<Route element={<Stats />} path="stats" />
				<Route element={<SEPAPaymentDetails />} path="sepa" />

				<Route element={<Issues />} path="issues" />
				<Route element={<MergePatientsForm />} path="merge" />

				<Route element={<DoctorsListRoutes />} path="doctors/*" />
				<Route element={<DoctorDetailsRoutes />} path="doctor/*" />

				<Route element={<InsurancesListRoutes />} path="insurances/*" />
				<Route element={<InsuranceDetailsRoutes />} path="insurance/*" />

				<Route element={<AllergiesListRoutes />} path="allergies/*" />
				<Route element={<AllergyDetailsRoutes />} path="allergy/*" />

				<Route element={<DrugsSearch />} path="drugs" />
				<Route element={<DrugDetails />} path="drug/:id" />

				<Route element={<Settings />} path="settings/*" />
				<Route element={<Authentication />} path="auth" />

				<Route element={<NoMatch />} path="*" />
			</Routes>
		</Suspense>
	);
}
