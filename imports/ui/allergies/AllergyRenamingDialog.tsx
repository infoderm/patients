import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameAllergy, useAllergiesFind} from '../../api/allergies';
import TagDocument from '../../api/tags/TagDocument';
import {inputFormat} from '../../api/string';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: TagDocument;
}

const AllergyRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="allergy"
			useTagsFind={useAllergiesFind}
			endpoint={renameAllergy}
			tag={tag}
			inputFormat={inputFormat}
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default AllergyRenamingDialog;
