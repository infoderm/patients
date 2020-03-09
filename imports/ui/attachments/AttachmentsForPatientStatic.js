import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import NoContent from '../navigation/NoContent.js';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentsGallery from '../attachments/AttachmentsGallery.js';

export default function AttachmentsForPatientStatic ( { classes , patientId , attachmentsInfo , ...rest } ) {

	return (
		<Fragment>
			{ attachmentsInfo.length === 0 &&
        		<NoContent>Nothing to see on page {page}.</NoContent>
			}
			<div {...rest}>
				<AttachmentsGallery attachmentsInfo={attachmentsInfo}/>
				<AttachFileButton className={classes.button} color="default" method="patients.attach" item={patientId}/>
			</div>
		</Fragment>
	) ;
}

AttachmentsForPatientStatic.propTypes = {
	classes: PropTypes.object.isRequired,
	patientId: PropTypes.string.isRequired,
	attachmentsInfo: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired,
};
