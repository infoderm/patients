import React from 'react';
import PropTypes from 'prop-types';

import TagDeletionDialog from '../tags/TagDeletionDialog.js';

export default function AllergyDeletionDialog({open, onClose, tag}) {
	return (
		<TagDeletionDialog
			open={open}
			title="allergy"
			method="allergies.delete"
			tag={tag}
			onClose={onClose}
		/>
	);
}

AllergyDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired
};
