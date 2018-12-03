import { Meteor } from 'meteor/meteor' ;

import { HLTReports } from '../api/hlt-reports.js' ;

export default function insertHLTReport ( history, fd ) {
  console.debug('insert-hlt-report', fd);
  const reader = new FileReader();
  reader.onload = function (event) {
    const raw = event.target.result;
    Meteor.subscribe('hlt-reports', {
      onReady: () => {
        const op = { raw } ;
        Meteor.call('hlt-reports.insert', op , (err, _id) => {
          if ( err ) console.error(err) ;
          else history.push({pathname: `/hlt-report/${_id}`}) ;
        });
      } ,
      onStop: err => console.error(err) ,
    });
  };
  reader.readAsText(fd);
}
