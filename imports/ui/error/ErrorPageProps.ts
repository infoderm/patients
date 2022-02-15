import {ErrorInfo} from 'react';

export default interface ErrorPageProps {
	error: Error;
	errorInfo: ErrorInfo;
	retry: () => void;
}
