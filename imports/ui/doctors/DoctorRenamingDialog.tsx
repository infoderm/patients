import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameDoctor, useDoctorsFind} from '../../api/doctors';

export default function DoctorRenamingDialog({open, onClose, onRename, tag}) {
	return (
		<TagRenamingDialog
			open={open}
			title="doctor"
			useTagsFind={useDoctorsFind}
			endpoint={renameDoctor}
			tag={tag}
			onClose={onClose}
			onRename={onRename}
		/>
	);
}

DoctorRenamingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired,
};
