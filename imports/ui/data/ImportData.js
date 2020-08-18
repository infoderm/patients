import React from 'react';

import { useHistory } from 'react-router-dom' ;

import Typography from '@material-ui/core/Typography' ;

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import insertDocument from '../../client/insertDocument.js' ;

import InputFileButton from '../input/InputFileButton.js';

export default function ImportData ( ) {

	const history = useHistory();

	const onImportHealthOne = event => {
		event.persist();
		console.debug(event.target.files);
		for ( const file of event.target.files ) {
			insertDocument(history, 'healthone', file);
		}
	} ;

	return (
		<div>
			<Typography variant="h3">Lab reports</Typography>
			<InputFileButton color="primary" onChange={onImportHealthOne}>
				Import Health One report<LibraryBooksIcon/>
			</InputFileButton>
			<InputFileButton disabled>
				Import Medar report<LibraryBooksIcon/>
			</InputFileButton>
			<InputFileButton disabled>
				Import Medidoc report<LibraryBooksIcon/>
			</InputFileButton>
		</div>
	) ;
}
