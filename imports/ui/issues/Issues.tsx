import React from 'react';
import {styled} from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import ConsultationsMissingAPrice from './ConsultationsMissingAPrice';
import ConsultationsMissingABook from './ConsultationsMissingABook';
import UnlinkedDocuments from './UnlinkedDocuments';
import UnparsedDocuments from './UnparsedDocuments';
import MangledDocuments from './MangledDocuments';
import UnattachedUploads from './UnattachedUploads';
import DoctorsWithNonAlphabeticalSymbols from './DoctorsWithNonAlphabeticalSymbols';

const PREFIX = 'Issues';

const classes = {
	container: `${PREFIX}-container`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.container}`]: {
		padding: theme.spacing(3),
	},
}));

const Issues = () => {
	return (
		<Root>
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
		</Root>
	);
};

export default Issues;
