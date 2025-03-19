import React from 'react';

import {Route, Routes, useParams} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import {myEncodeURIComponent} from '../../util/uri';

import NoContent from '../navigation/NoContent';
import TabJumper from '../navigation/TabJumper';

import ConsultationsMissingPaymentData from './ConsultationsMissingPaymentData';
import ConsultationsMissingABook from './ConsultationsMissingABook';
import ConsultationsWithPriceZeroNotInBookZero from './ConsultationsWithPriceZeroNotInBookZero';
import UnlinkedDocuments from './UnlinkedDocuments';
import UnparsedDocuments from './UnparsedDocuments';
import MangledDocuments from './MangledDocuments';
import UnattachedUploads from './UnattachedUploads';
import DoctorsWithNonAlphabeticalSymbols from './DoctorsWithNonAlphabeticalSymbols';

const PREFIX = 'Issues';

const classes = {
	container: `${PREFIX}-container`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.container}`]: {
		padding: theme.spacing(3),
	},
}));

const tabs = [
	'uploads-not-attached',
	'documents-not-decoded',
	'documents-not-parsed',
	'documents-not-linked',
	'consultations-no-payment',
	'consultations-no-book',
	'consultations-price-is-zero',
	'doctors-non-alphabetical',
];

const IssuesTabs = () => {
	const params = useParams<{tab?: string}>();
	return (
		<TabJumper
			tabs={tabs}
			current={params.tab}
			toURL={(x) => `${params.tab ? '../' : ''}${myEncodeURIComponent(x)}`}
		/>
	);
};

const Issues = () => {
	return (
		<Root>
			<Routes>
				<Route index element={<IssuesTabs />} />
				<Route path=":tab/*" element={<IssuesTabs />} />
			</Routes>

			<Routes>
				<Route path="/" element={<NoContent>Select an issue type</NoContent>} />
				<Route
					path="uploads-not-attached"
					element={
						<>
							<Typography variant="h3">
								Uploads that are not attached
							</Typography>
							<UnattachedUploads className={classes.container} />
						</>
					}
				/>
				<Route
					path="documents-not-parsed"
					element={
						<>
							<Typography variant="h3">
								Documents that are not parsed
							</Typography>
							<UnparsedDocuments className={classes.container} />
						</>
					}
				/>
				<Route
					path="documents-not-decoded"
					element={
						<>
							<Typography variant="h3">
								Documents that are not properly decoded
							</Typography>
							<MangledDocuments className={classes.container} />
						</>
					}
				/>
				<Route
					path="documents-not-linked"
					element={
						<>
							<Typography variant="h3">
								Documents that are not linked
							</Typography>
							<UnlinkedDocuments className={classes.container} />
						</>
					}
				/>
				<Route
					path="consultations-no-payment"
					element={
						<>
							<Typography variant="h3">
								Consultations missing payment data
							</Typography>
							<ConsultationsMissingPaymentData className={classes.container} />
						</>
					}
				/>
				<Route
					path="consultations-no-book"
					element={
						<>
							<Typography variant="h3">Consultations missing a book</Typography>
							<ConsultationsMissingABook className={classes.container} />
						</>
					}
				/>
				<Route
					path="consultations-price-is-zero"
					element={
						<>
							<Typography variant="h3">
								Consultations with price 0 not in book 0
							</Typography>
							<ConsultationsWithPriceZeroNotInBookZero
								className={classes.container}
							/>
						</>
					}
				/>
				<Route
					path="doctors-non-alphabetical"
					element={
						<>
							<Typography variant="h3">
								Doctors with non alphabetical symbols
							</Typography>
							<DoctorsWithNonAlphabeticalSymbols
								className={classes.container}
							/>
						</>
					}
				/>
			</Routes>
		</Root>
	);
};

export default Issues;
