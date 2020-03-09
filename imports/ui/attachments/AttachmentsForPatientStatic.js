import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentsGallery from '../attachments/AttachmentsGallery.js';

export default function AttachmentsForPatientStatic ( { classes , patient , attachmentsInfo , ...rest } ) {

	return (
		<Fragment>
			{ attachmentsInfo.length === 0 ?
				<Typography variant="h2">No attachments</Typography>
				:
				<Typography variant="h2">All attachments</Typography>
			}
			<div {...rest}>
				<AttachmentsGallery attachmentsInfo={attachmentsInfo}/>
				<AttachFileButton className={classes.button} color="default" method="patients.attach" item={patient._id}/>
			</div>
		</Fragment>
	) ;
}

AttachmentsForPatientStatic.propTypes = {
	classes: PropTypes.object.isRequired,
	patient: PropTypes.object.isRequired,
	attachmentsInfo: PropTypes.array.isRequired,
};
