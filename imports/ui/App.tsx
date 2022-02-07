import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {
	MuiThemeProvider,
	createMuiTheme,
	responsiveFontSizes,
} from '@material-ui/core/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@material-ui/core/CssBaseline';

import {LocalizationProvider} from '@material-ui/pickers';
import AdapterDateFns from '@material-ui/pickers/adapter/date-fns';

import {useLocale} from '../i18n/datetime';

import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import ErrorBoundary from './ErrorBoundary';
import AppFrame from './AppFrame';

let muitheme = createMuiTheme();
muitheme = responsiveFontSizes(muitheme);

const App = () => {
	const locale = useLocale();

	return (
		<BrowserRouter>
			<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
				<MuiThemeProvider theme={muitheme}>
					<CssBaseline />
					<SnackbarProvider maxSnack={10} autoHideDuration={8000}>
						<ErrorBoundary>
							<div>
								<CustomWholeWindowDropZone />
								<AppFrame />
							</div>
						</ErrorBoundary>
					</SnackbarProvider>
				</MuiThemeProvider>
			</LocalizationProvider>
		</BrowserRouter>
	);
};

export default App;
