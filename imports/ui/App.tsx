import React from 'react';

import {BrowserRouter} from 'react-router-dom';

import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@mui/material/CssBaseline';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import {useLocale} from '../i18n/datetime';

import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import ModalProvider from './modal/ModelProvider';
import ErrorBoundary from './ErrorBoundary';
import AppFrame from './AppFrame';
import useUserTheme from './useUserTheme';
import StatusNotifications from './StatusNotifications';
import PlannerProvider from './planner/PlannerProvider';

const App = () => {
	const locale = useLocale();
	const theme = useUserTheme();

	return (
		<BrowserRouter>
			<LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={theme}>
						<ModalProvider>
							<CssBaseline />
							<PlannerProvider>
								<ErrorBoundary>
									<StatusNotifications />
									<SnackbarProvider maxSnack={10} autoHideDuration={8000}>
										<CustomWholeWindowDropZone />
										<AppFrame />
									</SnackbarProvider>
								</ErrorBoundary>
							</PlannerProvider>
						</ModalProvider>
					</ThemeProvider>
				</StyledEngineProvider>
			</LocalizationProvider>
		</BrowserRouter>
	);
};

export default App;
