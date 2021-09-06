import React from 'react';
import PropTypes from 'prop-types';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteAllergy} from '../../api/allergies';

export default function AllergyDeletionDialog({open, onClose, tag}) {
	return (
		<TagDeletionDialog
			open={open}
			title="allergy"
			endpoint={deleteAllergy}
			tag={tag}
			onClose={onClose}
		/>
	);
}

AllergyDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired,
};
