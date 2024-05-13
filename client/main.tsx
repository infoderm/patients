// eslint-disable-next-line import/order, import/no-unassigned-import
import './polyfill';

import React, {StrictMode} from 'react';

import {Meteor} from 'meteor/meteor';
import {createRoot} from 'react-dom/client.js';

import App from '../imports/ui/App';
import rootNode from '../imports/ui/rootNode';

Meteor.startup(() => {
	const root = createRoot(rootNode());
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
});
