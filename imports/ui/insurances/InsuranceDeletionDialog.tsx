import React from 'react';
import PropTypes from 'prop-types';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteInsurance} from '../../api/insurances';

export default function InsuranceDeletionDialog({open, onClose, tag}) {
	return (
		<TagDeletionDialog
			open={open}
			title="insurance"
			endpoint={deleteInsurance}
			tag={tag}
			onClose={onClose}
		/>
	);
}

InsuranceDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired,
};
