import React from 'react';
import MuiTooltip from '@mui/material/Tooltip';

import PropsOf from '../../util/PropsOf';

const Tooltip = (props: PropsOf<typeof MuiTooltip>) => (
	<MuiTooltip disableFocusListener {...props} />
);

export default Tooltip;
