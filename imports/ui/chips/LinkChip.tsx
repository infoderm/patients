import React from 'react';

import {Link} from 'react-router-dom';
import Chip from '@mui/material/Chip';

const LinkChip = ({to, ...rest}) => <Chip component={Link} to={to} {...rest} />;

export default LinkChip;
