import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteDoctor} from '../../api/doctors';
import PropsOf from '../../util/PropsOf';

type Props = Omit<PropsOf<typeof TagDeletionDialog>, 'endpoint' | 'title'>;

const DoctorDeletionDialog = (props: Props) => {
	return (
		<TagDeletionDialog title="doctor" endpoint={deleteDoctor} {...props} />
	);
};

export default DoctorDeletionDialog;
