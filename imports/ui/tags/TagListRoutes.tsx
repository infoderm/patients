import React from 'react';
import {Route, Routes} from 'react-router-dom';

import type PropsOf from '../../util/PropsOf';
import TagListRoute from './TagListRoute';

type Props = PropsOf<typeof TagListRoute>;

const TagListRoutes = (props: Props) => {
	const route = <TagListRoute {...props} />;
	return (
		<Routes>
			<Route path="/*" element={route} />
			<Route path="query/:type/:filter/*" element={route} />
		</Routes>
	);
};

export default TagListRoutes;
