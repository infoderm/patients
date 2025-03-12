import React from 'react';
import MuiTooltip from '@mui/material/Tooltip';

import type PropsOf from '../../util/types/PropsOf';

const Tooltip = (props: PropsOf<typeof MuiTooltip>) => (
	<MuiTooltip disableFocusListener {...props} />
);

export default Tooltip;
