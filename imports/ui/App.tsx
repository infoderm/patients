import React from 'react';

import {BrowserRouter, Routes, Route, useNavigate, NavigateFunction, Path} from 'react-router-dom';

import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {ThemeProvider} from '@mui/material/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@mui/material/CssBaseline';

import isTest from '../app/isTest';

import DateTimeLocalizationProvider from './i18n/DateTimeLocalizationProvider';
import CustomWholeWindowDropZone from './input/CustomWholeWindowDropZone';
import ModalProvider from './modal/ModelProvider';
import ErrorBoundary from './ErrorBoundary';
import AppFrame from './AppFrame';
import useUserTheme from './useUserTheme';
import StatusNotifications from './StatusNotifications';
import PlannerProvider from './planner/PlannerProvider';

export const muiCache = createCache({
	key: 'mui',
	prepend: true,
});

export let _navigate: NavigateFunction = (_to: Partial<Path> | string | number) => {
	// TODO: This gets called in non-full-app client tests.
	console.warn('Using unitialized test-only _navigate function call.');
};

const _Routes = ({children}) => {
	_navigate = useNavigate();
	return (<Routes>
		<Route element={<div>test-only reset page</div>} path="/_test/reset" />
		<Route element={{...children}} path="*" />
	</Routes>)
};

const Router = isTest()
	? ({children}) => {
		return (
			<BrowserRouter>
				<_Routes>{children}</_Routes>
			</BrowserRouter>
		)
	} : BrowserRouter;

const App = () => {
	const theme = useUserTheme();

	return (
		<Router>
			<DateTimeLocalizationProvider>
				<CacheProvider value={muiCache}>
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
				</CacheProvider>
			</DateTimeLocalizationProvider>
		</Router>
	);
};

export default App;
