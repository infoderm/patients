import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog.js';

import {Allergies} from '../../api/allergies.js';

export default function AllergyRenamingDialog({open, onClose, onRename, tag}) {
	return (
		<TagRenamingDialog
			open={open}
			title="allergy"
			collection={Allergies}
			subscription="allergies"
			method="allergies.rename"
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
	tag: PropTypes.object.isRequired
};
