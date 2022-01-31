import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteDoctor} from '../../api/doctors';

interface Props {
	open: boolean;
	onClose: () => void;
	tag: {};
}

const DoctorDeletionDialog = ({open, onClose, tag}: Props) => {
	return (
		<TagDeletionDialog
			open={open}
			title="doctor"
			endpoint={deleteDoctor}
			tag={tag}
			onClose={onClose}
		/>
	);
};

export default DoctorDeletionDialog;
