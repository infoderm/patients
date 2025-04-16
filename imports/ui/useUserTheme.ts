import {useMemo} from 'react';

import {createTheme, responsiveFontSizes} from '@mui/material/styles';

import {useSettingCached} from './settings/hooks';

const useUserTheme = () => {
	const {value: mode} = useSettingCached('theme-palette-mode');
	const {value: primary} = useSettingCached('theme-palette-primary');
	const {value: secondary} = useSettingCached('theme-palette-secondary');
	const {value: contrastThreshold} = useSettingCached(
		'theme-palette-contrast-threshold',
	);
	return useMemo(() => {
		const theme = responsiveFontSizes(
			createTheme({
				palette: {
					mode,
					primary: {main: primary},
					secondary: {main: secondary},
					contrastThreshold,
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
		return createTheme(theme, {
			palette: {
				red: theme.palette.augmentColor({
					color: {
						main: '#f88',
						contrastText: '#fff',
					},
					name: 'red',
				}),
				green: theme.palette.augmentColor({
					color: {
						main: '#8f8',
						contrastText: '#fff',
					},
					name: 'green',
				}),
				blue: theme.palette.augmentColor({
					color: {
						main: '#88f',
						contrastText: '#fff',
					},
					name: 'blue',
				}),
			},
		});
	}, [mode, primary, secondary, contrastThreshold]);
};

export default useUserTheme;
