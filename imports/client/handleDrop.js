import { Meteor } from 'meteor/meteor' ;
import Papa from 'papaparse' ;

import insertFromXML from './insertFromXML.js' ;

export default function handleDrop ( data ) {

  console.log(data);

  for (const item of data.items) {
    if (item.kind === 'file' && item.type === 'text/csv') {
      const f = item.getAsFile();
      let i = 0;
      Papa.parse(f, {
        header: true,
        dynamicTyping: true,
        chunk: Meteor.bindEnvironment((results, parser) => {
            Meteor.call('drugs.insertMany', results.data);
            i += results.data.length;
        }),
        complete: () => {
            console.log(i);
        }
      });
    }
    else if ( item.type === 'text/plain' ) {
      const xmlString = data.getData('text/plain');
      insertFromXML(xmlString);
    }
  }

}
