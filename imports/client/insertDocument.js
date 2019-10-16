import { Meteor } from 'meteor/meteor' ;

import { Documents } from '../api/documents.js' ;

export default function insertDocument ( history, format, fd ) {
  console.debug('insert-document', format, fd);
  const reader = new FileReader();
  reader.onload = function (event) {
    const source = event.target.result;
    Meteor.subscribe('documents', {
      onReady: () => {
        const op = {
          format,
          source,
        } ;
        Meteor.call('documents.insert', op , (err, _id) => {
          if ( err ) console.error(err) ;
          else {
            if ( history && history.location.pathname !== '/documents') {
              history.push({pathname: '/documents'}) ;
            }
          }
        });
      } ,
      onStop: err => console.error(err) ,
    });
  };
  reader.readAsText(fd);
}
