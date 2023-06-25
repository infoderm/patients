import React from 'react';

import NoContent from '../navigation/NoContent';

import ErrorLog from './ErrorLog';
import type ErrorPageProps from './ErrorPageProps';
import RestoreAppAfterErrorButtons from './RestoreAppAfterErrorButtons';
import ErrorExplanation from './ErrorExplanation';

const AnyErrorPage = ({error, errorInfo, retry}: ErrorPageProps) => {
	return (
		<div>
			<NoContent>Something went wrong.</NoContent>
			<ErrorExplanation>
				To restore the app to a working state first try one of the buttons.
				<br />
				If that does not work, close the app and open it again.
			</ErrorExplanation>
			<RestoreAppAfterErrorButtons retry={retry} />
			<ErrorLog error={error} errorInfo={errorInfo} />
		</div>
	);
};

export default AnyErrorPage;
