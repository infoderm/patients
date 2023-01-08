import React from 'react';

import {Route, Routes} from 'react-router-dom';

import type PropsOf from '../../util/PropsOf';

type Props = {
	paths: string[];
	element: JSX.Element;
};

const Branches = ({paths, element}: Props) => (
	<Routes>
		{paths.map((path) => (
			<Route key={path} path={path} element={element} />
		))}
	</Routes>
);

const branched =
	<C extends React.ElementType>(paths: string[]) =>
	(Component: C) =>
	(props: PropsOf<C>) =>
		<Branches paths={paths} element={<Component {...props} />} />;

export type BranchProps<C extends React.ElementType> = {
	component: C;
	props: PropsOf<C>;
};

type BranchElementType<C extends React.ElementType> = React.ElementType<
	BranchProps<C>
>;

const branch =
	<C extends React.ElementType>(
		paths: string[],
		Branch: BranchElementType<C>,
	) =>
	(component: C) =>
		branched(paths)((props: PropsOf<C>) => (
			<Branch component={component} props={props} />
		));

export default branch;
