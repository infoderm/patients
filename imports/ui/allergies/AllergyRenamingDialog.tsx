import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameAllergy, useAllergiesFind} from '../../api/allergies';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: {};
}

const AllergyRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="allergy"
			useTagsFind={useAllergiesFind}
			endpoint={renameAllergy}
			tag={tag}
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default AllergyRenamingDialog;
