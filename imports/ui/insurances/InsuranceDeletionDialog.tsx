import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteInsurance} from '../../api/insurances';
import type PropsOf from '../../lib/types/PropsOf';

type Props = Omit<PropsOf<typeof TagDeletionDialog>, 'endpoint' | 'title'>;

const InsuranceDeletionDialog = (props: Props) => {
	return (
		<TagDeletionDialog
			title="insurance"
			endpoint={deleteInsurance}
			nameKey="displayName"
			nameKeyTitle="display name"
			{...props}
		/>
	);
};

export default InsuranceDeletionDialog;
