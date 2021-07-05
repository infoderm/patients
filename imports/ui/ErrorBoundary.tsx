import React from 'react';
import GenericErrorBoundary from './error/GenericErrorBoundary';
import ErrorPage from './ErrorPage';

export default function ErrorBoundary({children}) {
	return (
		<GenericErrorBoundary component={ErrorPage}>
			{children}
		</GenericErrorBoundary>
	);
}
