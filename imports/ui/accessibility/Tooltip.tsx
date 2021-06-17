import React from 'react';
import MuiTooltip from '@material-ui/core/Tooltip';

import PropsOf from '../../util/PropsOf.js';

const Tooltip = (props: PropsOf<typeof MuiTooltip>) => (
	<MuiTooltip disableFocusListener {...props} />
);

export default Tooltip;
