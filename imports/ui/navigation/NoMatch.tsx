import React from 'react';
import {useLocation} from 'react-router-dom';

import NoContent from './NoContent';

const NoMatch = () => {
	const location = useLocation();
	return (
		<NoContent>
			No match for <code>{location.pathname}</code>.
		</NoContent>
	);
};

export default NoMatch;
