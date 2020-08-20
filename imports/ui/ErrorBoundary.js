import React from 'react';
import GenericErrorBoundary from './error/GenericErrorBoundary.js';
import ErrorPage from './ErrorPage.js';

export default function ErrorBoundary({children}) {
	return (
		<GenericErrorBoundary component={ErrorPage}>
			{children}
		</GenericErrorBoundary>
	);
}
