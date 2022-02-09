import {indigo, pink} from '@mui/material/colors';

import {createTheme, responsiveFontSizes} from '@mui/material/styles';

const theme = responsiveFontSizes(
	createTheme({
		palette: {
			primary: indigo,
			secondary: pink,
		},
		components: {
			MuiTextField: {
				defaultProps: {
					variant: 'standard',
				},
			},
		},
	}),
);

const useUserTheme = () => theme;

export default useUserTheme;
