import insertPatient from './insertPatient.js' ;
import insertDrugs from './insertDrugs.js' ;
import insertHLTReport from './insertHLTReport.js' ;

function unpack ( data , item ) {

  if (item.kind === 'file') {
    const f = item.getAsFile();
    if (item.type === 'text/csv') return [ 'drugs' , f ] ;
    else if (f.name.endsWith('.HLT')) return ['hlt-report', f] ;
    else return ['unknown-file', f] ;
  }
  else if (item.kind === 'string') {
    if ( item.type === 'text/plain' ) {
      const xmlString = data.getData('text/plain');
      return ['patient', xmlString];
    }
  }

  return ['unknown', item];

}

export default function handleDrop ( history ) {

  return data => {

    console.log(data);

    for (const item of data.items) {
      const [kind, object] = unpack( data , item ) ;
      switch ( kind ) {
        case 'drugs':
          insertDrugs(object);
          break;
        case 'patient':
          insertPatient(history, object);
          break;
        case 'hlt-report':
          insertHLTReport(history, object);
          break;
        default:
          console.debug('handleDrop-default', kind, object);
          break;
      }
    }

  } ;

}
