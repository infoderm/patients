import React from 'react';

import {Link} from 'react-router-dom';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import type PropsOf from '../../util/PropsOf';

import FixedFab from '../button/FixedFab';

const Prev = (props: PropsOf<typeof FixedFab>) => (
	<FixedFab col={3} color="primary" component={Link} {...props}>
		<NavigateBeforeIcon />
	</FixedFab>
);

export default Prev;
