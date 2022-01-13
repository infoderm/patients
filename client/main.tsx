// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import React from 'react';

import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';

import App from '../imports/ui/App';
import rootNode from '../imports/ui/rootNode';

Meteor.startup(() => {
	render(<App />, rootNode());
});
