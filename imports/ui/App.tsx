import React from 'react';

import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {ThemeProvider} from '@mui/material/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@mui/material/CssBaseline';

import DateTimeLocalizationProvider from './i18n/DateTimeLocalizationProvider';
import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import ModalProvider from './modal/ModelProvider';
import ErrorBoundary from './ErrorBoundary';
import AppFrame from './AppFrame';
import useUserTheme from './useUserTheme';
import StatusNotifications from './StatusNotifications';
import PlannerProvider from './planner/PlannerProvider';
import {Router} from './Router';

export const muiCache = createCache({
	key: 'mui',
	prepend: true,
});

const App = () => {
	const theme = useUserTheme();

	return (
		<Router>
			<DateTimeLocalizationProvider>
				<CacheProvider value={muiCache}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<ErrorBoundary>
							<StatusNotifications />
							<SnackbarProvider maxSnack={10} autoHideDuration={8000}>
								<ModalProvider>
									<CustomWholeWindowDropZone />
									<PlannerProvider>
										<AppFrame />
									</PlannerProvider>
								</ModalProvider>
							</SnackbarProvider>
						</ErrorBoundary>
					</ThemeProvider>
				</CacheProvider>
			</DateTimeLocalizationProvider>
		</Router>
	);
};

export default App;
