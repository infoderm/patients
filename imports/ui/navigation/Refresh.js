import React from 'react';

import RefreshIcon from '@material-ui/icons/Refresh';
import FixedFab from '../button/FixedFab.js';

const Refresh = (props) => (
	<FixedFab col={1} {...props}>
		<RefreshIcon />
	</FixedFab>
);

export default Refresh;
