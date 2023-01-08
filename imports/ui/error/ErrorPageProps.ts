import {type ErrorInfo} from 'react';

type ErrorPageProps = {
	error: Error;
	errorInfo: ErrorInfo;
	retry: () => void;
};
export default ErrorPageProps;
