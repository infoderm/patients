import React from 'react' ;
import { useHistory } from 'react-router-dom' ;
import handleDrop from '../../client/handleDrop.js' ;
import WholeWindowDropZone from './WholeWindowDropZone.js' ;

export default function CustomWholeWindowDropZone ( ) {
	const history = useHistory();
	return <WholeWindowDropZone callback={handleDrop(history)}/> ;
}
