import {useTheme} from '@mui/material/styles';
import {createMakeAndWithStyles} from 'tss-react';

import type useUserTheme from '../useUserTheme';

export const {makeStyles, withStyles} = createMakeAndWithStyles({
	useTheme: useTheme as () => ReturnType<typeof useUserTheme>,
});
