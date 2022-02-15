import React from 'react';
import GenericErrorBoundary from './error/GenericErrorBoundary';
import ErrorPage from './ErrorPage';

const ErrorBoundary = ({children}) => {
	return (
		<GenericErrorBoundary component={ErrorPage}>
			{children}
		</GenericErrorBoundary>
	);
};

export default ErrorBoundary;
