import {useMemo} from 'react';

import {createTheme, responsiveFontSizes} from '@mui/material/styles';

import {useSettingCached} from './settings/hooks';

const useUserTheme = () => {
	const {value: mode} = useSettingCached('theme-palette-mode');
	const {value: primary} = useSettingCached('theme-palette-primary');
	const {value: secondary} = useSettingCached('theme-palette-secondary');
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
					MuiFormControl: {
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
