import React from 'react';
import type ErrorPageProps from './error/ErrorPageProps';
import AnyErrorPage from './error/AnyErrorPage';
import NetworkErrorPage from './error/NetworkErrorPage';

const ErrorPage = ({error, errorInfo, retry}: ErrorPageProps) => {
	if (
		error instanceof TypeError &&
		error.message === 'NetworkError when attempting to fetch resource.'
	) {
		return (
			<NetworkErrorPage error={error} errorInfo={errorInfo} retry={retry} />
		);
	}

	return <AnyErrorPage error={error} errorInfo={errorInfo} retry={retry} />;
};

export default ErrorPage;
