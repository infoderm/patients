import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes,
} from '@mui/material/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@mui/material/CssBaseline';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import {useLocale} from '../i18n/datetime';

import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import ErrorBoundary from './ErrorBoundary';
import AppFrame from './AppFrame';

let theme = createTheme();
theme = responsiveFontSizes(theme);

const App = () => {
	const locale = useLocale();

	return (
		<BrowserRouter>
			<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<SnackbarProvider maxSnack={10} autoHideDuration={8000}>
						<ErrorBoundary>
							<div>
								<CustomWholeWindowDropZone />
								<AppFrame />
							</div>
						</ErrorBoundary>
					</SnackbarProvider>
				</ThemeProvider>
			</LocalizationProvider>
		</BrowserRouter>
	);
};

export default App;
