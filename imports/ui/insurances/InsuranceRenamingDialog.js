import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog.js';

import {useInsurancesFind} from '../../api/insurances.js';

export default function InsuranceRenamingDialog({
	open,
	onClose,
	onRename,
	tag
}) {
	return (
		<TagRenamingDialog
			open={open}
			title="insurance"
			useTagsFind={useInsurancesFind}
			method="insurances.rename"
			tag={tag}
			onClose={onClose}
			onRename={onRename}
		/>
	);
}

InsuranceRenamingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired
};
