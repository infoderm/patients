import React from 'react';
import PropTypes from 'prop-types';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteDoctor} from '../../api/doctors';

export default function DoctorDeletionDialog({open, onClose, tag}) {
	return (
		<TagDeletionDialog
			open={open}
			title="doctor"
			endpoint={deleteDoctor}
			tag={tag}
			onClose={onClose}
		/>
	);
}

DoctorDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired,
};
