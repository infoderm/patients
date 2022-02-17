import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteInsurance} from '../../api/insurances';
import PropsOf from '../../util/PropsOf';

type Props = Omit<PropsOf<typeof TagDeletionDialog>, 'endpoint' | 'title'>;

const InsuranceDeletionDialog = (props: Props) => {
	return (
		<TagDeletionDialog
			title="insurance"
			endpoint={deleteInsurance}
			{...props}
		/>
	);
};

export default InsuranceDeletionDialog;
