// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import React from 'react';

import {Meteor} from 'meteor/meteor';
import {createRoot} from 'react-dom/client';

import App from '../imports/ui/App';
import rootNode from '../imports/ui/rootNode';

Meteor.startup(() => {
	const container = rootNode();
	const root = createRoot(container);
	root.render(<App />);
});
