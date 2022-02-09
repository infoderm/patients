import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@mui/material/CssBaseline';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import {useLocale} from '../i18n/datetime';

import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import ErrorBoundary from './ErrorBoundary';
import AppFrame from './AppFrame';
import useUserTheme from './useUserTheme';

const App = () => {
	const locale = useLocale();
	const theme = useUserTheme();

	return (
		<BrowserRouter>
			<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
				<StyledEngineProvider injectFirst>
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
				</StyledEngineProvider>
			</LocalizationProvider>
		</BrowserRouter>
	);
};

export default App;
