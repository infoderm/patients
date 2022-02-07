import React from 'react';

import {Link} from 'react-router-dom';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import PropsOf from '../../util/PropsOf';

import FixedFab from '../button/FixedFab';

interface Props extends PropsOf<typeof FixedFab> {
	to: string;
}

const Prev = ({to, ...rest}: Props) => (
	<FixedFab col={3} color="primary" component={Link} to={to} {...rest}>
		<NavigateBeforeIcon />
	</FixedFab>
);

export default Prev;
