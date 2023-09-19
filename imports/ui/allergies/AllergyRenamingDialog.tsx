import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameAllergy, useAllergiesFind} from '../../api/allergies';
import type TagDocument from '../../api/tags/TagDocument';
import {formattedLineInput} from '../../api/string';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onRename: () => void;
	readonly tag: TagDocument;
};

const AllergyRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="allergy"
			useTagsFind={useAllergiesFind}
			endpoint={renameAllergy}
			tag={tag}
			inputFormat={formattedLineInput}
			nameKey="displayName"
			nameKeyTitle="display name"
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default AllergyRenamingDialog;
