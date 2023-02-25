import React from 'react';

import {Link} from 'react-router-dom';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import type PropsOf from '../../lib/types/PropsOf';

import FixedFab from '../button/FixedFab';

const Next = (props: PropsOf<typeof FixedFab>) => (
	<FixedFab col={2} color="primary" component={Link} {...props}>
		<NavigateNextIcon />
	</FixedFab>
);

export default Next;
