import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameDoctor, useDoctorsFind} from '../../api/doctors';
import type TagDocument from '../../api/tags/TagDocument';
import {formattedLineInput} from '../../api/string';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onRename: () => void;
	readonly tag: TagDocument;
};

const DoctorRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="doctor"
			useTagsFind={useDoctorsFind}
			endpoint={renameDoctor}
			tag={tag}
			inputFormat={formattedLineInput}
			nameKey="displayName"
			nameKeyTitle="display name"
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default DoctorRenamingDialog;
