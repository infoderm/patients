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

import isTest from '../app/isTest';

import createPromise from '../lib/async/createPromise';

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

export const Router = isTest()
	? ({children}) => {
			return (
				<BrowserRouter>
					<WithTestRoutes>{children}</WithTestRoutes>
				</BrowserRouter>
			);
	  }
	: BrowserRouter;
