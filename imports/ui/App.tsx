import React, {useEffect} from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
	type Path,
	type NavigateOptions,
	type To,
} from 'react-router-dom';

import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {ThemeProvider} from '@mui/material/styles';

import {SnackbarProvider} from 'notistack';

import CssBaseline from '@mui/material/CssBaseline';

import isTest from '../app/isTest';

import createPromise from '../lib/async/createPromise';

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

export type NavigateFunction = {
	(to: To, options?: NavigateOptions): Promise<void>;
	(delta: number): Promise<void>;
};

export const _router: {navigate: NavigateFunction} = {
	async navigate(_to: Partial<Path> | string | number) {
		console.warn('Using unitialized test-only _navigate function call.');
	},
};

const useNavigationEffect = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const _navigation = createPromise<void>();
		_router.navigate = async (to: any) => {
			navigate(to);
			await _navigation.promise;
		};

		return () => {
			_navigation.resolve();
		};
	}, [navigate]);
};

const UnmountRoute = () => {
	useNavigationEffect();
	return <div>test-only unmount route</div>;
};

const MainRoute = ({children}) => {
	useNavigationEffect();
	return {...children};
};

const WithTestRoutes = ({children}) => {
	return (
		<Routes>
			<Route element={<UnmountRoute />} path="/_test/unmount" />
			<Route element={<MainRoute>{children}</MainRoute>} path="*" />
		</Routes>
	);
};

const Router = isTest()
	? ({children}) => {
			return (
				<BrowserRouter>
					<WithTestRoutes>{children}</WithTestRoutes>
				</BrowserRouter>
			);
	  }
	: BrowserRouter;

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
