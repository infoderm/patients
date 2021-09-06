import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameAllergy, useAllergiesFind} from '../../api/allergies';

export default function AllergyRenamingDialog({open, onClose, onRename, tag}) {
	return (
		<TagRenamingDialog
			open={open}
			title="allergy"
			useTagsFind={useAllergiesFind}
			endpoint={renameAllergy}
			tag={tag}
			onClose={onClose}
			onRename={onRename}
		/>
	);
}

AllergyRenamingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired,
};
