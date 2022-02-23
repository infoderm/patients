import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameDoctor, useDoctorsFind} from '../../api/doctors';
import TagDocument from '../../api/tags/TagDocument';
import {inputFormat} from '../../api/string';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: TagDocument;
}

const DoctorRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="doctor"
			useTagsFind={useDoctorsFind}
			endpoint={renameDoctor}
			tag={tag}
			inputFormat={inputFormat}
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default DoctorRenamingDialog;
