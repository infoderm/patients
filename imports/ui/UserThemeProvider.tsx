import React from 'react';

import {ThemeProvider} from '@mui/material/styles';

import useUserTheme from './useUserTheme';

const UserThemeProvider = ({
	children,
}: {
	readonly children: React.ReactNode;
}) => {
	const theme = useUserTheme();
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default UserThemeProvider;
