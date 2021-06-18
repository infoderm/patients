// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import React from 'react';

import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {LocalizationProvider} from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';

import App from '../imports/ui/App';
import rootNode from '../imports/ui/rootNode';

Meteor.startup(() =>
	render(
		<LocalizationProvider dateAdapter={DateFnsUtils}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</LocalizationProvider>,
		rootNode()
	)
);
