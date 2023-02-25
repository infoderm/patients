import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteDoctor} from '../../api/doctors';
import type PropsOf from '../../lib/types/PropsOf';

type Props = Omit<PropsOf<typeof TagDeletionDialog>, 'endpoint' | 'title'>;

const DoctorDeletionDialog = (props: Props) => {
	return (
		<TagDeletionDialog
			title="doctor"
			endpoint={deleteDoctor}
			nameKey="displayName"
			nameKeyTitle="display name"
			{...props}
		/>
	);
};

export default DoctorDeletionDialog;
