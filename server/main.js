import { Meteor } from 'meteor/meteor';

import '../imports/api/patients.js';
import '../imports/api/drugs.js';

Meteor.startup(() => {
  // code to run on server at startup
  // e.g. creation of mongodb indices
});
