import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ConsultationsMissingAPrice from './ConsultationsMissingAPrice.js';
import ConsultationsMissingABook from './ConsultationsMissingABook.js';
import UnlinkedDocuments from './UnlinkedDocuments.js';
import UnparsedDocuments from './UnparsedDocuments.js';
import MangledDocuments from './MangledDocuments.js';
import UnattachedUploads from './UnattachedUploads.js';
import DoctorsWithNonAlphabeticalSymbols from './DoctorsWithNonAlphabeticalSymbols.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	}
}));

export default function Issues() {
	const classes = useStyles();

	return (
		<div>
			<Typography variant="h3">Uploads that are not attached</Typography>
			<UnattachedUploads className={classes.container} />
			<Typography variant="h3">Documents that are not parsed</Typography>
			<UnparsedDocuments className={classes.container} />
			<Typography variant="h3">
				Documents that are not properly decoded
			</Typography>
			<MangledDocuments className={classes.container} />
			<Typography variant="h3">Documents that are not linked</Typography>
			<UnlinkedDocuments className={classes.container} />
			<Typography variant="h3">Consultations missing a price</Typography>
			<ConsultationsMissingAPrice className={classes.container} />
			<Typography variant="h3">Consultations missing a book</Typography>
			<ConsultationsMissingABook className={classes.container} />
			<Typography variant="h3">
				Doctors with non alphabetical symbols
			</Typography>
			<DoctorsWithNonAlphabeticalSymbols className={classes.container} />
		</div>
	);
}
