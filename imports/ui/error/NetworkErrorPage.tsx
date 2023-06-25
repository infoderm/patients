import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import NoContent from '../navigation/NoContent';
import useStatus from '../users/useStatus';
import usePreviousRenderValues from '../hooks/usePreviousRenderValues';

import ErrorLog from './ErrorLog';
import type ErrorPageProps from './ErrorPageProps';
import ErrorExplanation from './ErrorExplanation';
import ReconnectAfterNetworkErrorButtons from './ReconnectAfterNetworkErrorButtons';

const NetworkErrorPage = ({error, errorInfo}: ErrorPageProps) => {
	const navigate = useNavigate();
	const {status} = useStatus();
	const [previous] = usePreviousRenderValues([status]);

	useEffect(() => {
		if (
			previous !== undefined &&
			previous !== 'connected' &&
			status === 'connected'
		) {
			navigate(0);
		}
	}, [previous, status, navigate]);

	return (
		<div>
			<NoContent>Network error.</NoContent>
			<ErrorExplanation>
				There was an error while fetching a network resource.
				<br />
				To restore the app to a working state first try to reconnect with the
				server.
			</ErrorExplanation>
			<ReconnectAfterNetworkErrorButtons />
			<ErrorLog error={error} errorInfo={errorInfo} />
		</div>
	);
};

export default NetworkErrorPage;
