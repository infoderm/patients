import React from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import FixedFab from '../button/FixedFab';

const Refresh = (props) => (
	<FixedFab col={1} {...props}>
		<RefreshIcon />
	</FixedFab>
);

export default Refresh;
