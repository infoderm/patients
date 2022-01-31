import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameDoctor, useDoctorsFind} from '../../api/doctors';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: {};
}

const DoctorRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
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
};

export default DoctorRenamingDialog;
