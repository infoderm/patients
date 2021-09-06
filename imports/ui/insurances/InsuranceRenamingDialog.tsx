import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameInsurance, useInsurancesFind} from '../../api/insurances';

export default function InsuranceRenamingDialog({
	open,
	onClose,
	onRename,
	tag,
}) {
	return (
		<TagRenamingDialog
			open={open}
			title="insurance"
			useTagsFind={useInsurancesFind}
			endpoint={renameInsurance}
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
	tag: PropTypes.object.isRequired,
};
