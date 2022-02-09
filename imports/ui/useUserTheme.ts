import {useMemo} from 'react';

import {createTheme, responsiveFontSizes} from '@mui/material/styles';

import {useSetting} from './settings/hooks';

const useUserTheme = () => {
	const {value: mode} = useSetting('theme-palette-mode');
	const {value: primary} = useSetting('theme-palette-primary');
	const {value: secondary} = useSetting('theme-palette-secondary');
	return useMemo(() => {
		return responsiveFontSizes(
			createTheme({
				palette: {
					mode,
					primary: {main: primary},
					secondary: {main: secondary},
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
	}, [mode, primary, secondary]);
};

export default useUserTheme;
