import React from 'react';

import {Link} from 'react-router-dom';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import PropsOf from '../../util/PropsOf';

import FixedFab from '../button/FixedFab';

interface Props extends PropsOf<typeof FixedFab> {
	to: string;
}

const Next = ({to, ...rest}: Props) => (
	<FixedFab col={2} color="primary" component={Link} to={to} {...rest}>
		<NavigateNextIcon />
	</FixedFab>
);

export default Next;
