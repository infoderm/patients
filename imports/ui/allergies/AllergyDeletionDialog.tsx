import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteAllergy} from '../../api/allergies';

interface Props {
	open: boolean;
	onClose: () => void;
	tag: {};
}

const AllergyDeletionDialog = ({open, onClose, tag}: Props) => {
	return (
		<TagDeletionDialog
			open={open}
			title="allergy"
			endpoint={deleteAllergy}
			tag={tag}
			onClose={onClose}
		/>
	);
};

export default AllergyDeletionDialog;
