import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import DocumentCard from '../documents/DocumentCard.js';

export default function DocumentsForPatientStatic ( { patientId , documents , ...rest } ) {

	return (
		<Fragment>
			{ documents.length === 0 ?
				<Typography variant="h2">No documents</Typography>
				:
				<Typography variant="h2">Last documents</Typography>
			}
			<div {...rest}>
				{ documents.map((document, i) => (
					<DocumentCard
						key={document._id}
						document={document}
						patientChip={false}
						defaultExpanded={!i}
					/>
					))
				}
			</div>
		</Fragment>
	) ;
}

DocumentsForPatientStatic.propTypes = {
	documents: PropTypes.array.isRequired,
};
