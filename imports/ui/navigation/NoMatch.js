import React from 'react';
import PropTypes from 'prop-types';

import NoContent from './NoContent';

export default function NoMatch({location}) {
	return (
		<NoContent>
			No match for <code>{location.pathname}</code>.
		</NoContent>
	);
}

NoMatch.propTypes = {
	location: PropTypes.object.isRequired
};
