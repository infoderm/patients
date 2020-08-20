import "regenerator-runtime/runtime.js";
import React from 'react';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';

import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Roboto:300,400,500']
  }
});

import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.js';

// required for pdfjs to work
(typeof window !== 'undefined' ? window : {}).pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

Meteor.startup(
  () => render(
    (
      <LocalizationProvider dateAdapter={DateFnsUtils}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </LocalizationProvider>
    ) ,
    document.getElementById('render-target')
  )
);
