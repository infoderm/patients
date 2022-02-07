import paged from '../routes/paged';

import PatientsObservedSearchResultsPage from './PatientsObservedSearchResultsPage';

const PatientsObservedSearchResultsPager = paged(
	PatientsObservedSearchResultsPage,
);

export default PatientsObservedSearchResultsPager;
