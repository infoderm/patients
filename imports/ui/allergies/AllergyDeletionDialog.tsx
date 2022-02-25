import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteAllergy} from '../../api/allergies';
import PropsOf from '../../util/PropsOf';

type Props = Omit<PropsOf<typeof TagDeletionDialog>, 'endpoint' | 'title'>;

const AllergyDeletionDialog = (props: Props) => {
	return (
		<TagDeletionDialog
			title="allergy"
			endpoint={deleteAllergy}
			nameKey="displayName"
			nameKeyTitle="display name"
			{...props}
		/>
	);
};

export default AllergyDeletionDialog;
