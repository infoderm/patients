// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
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
