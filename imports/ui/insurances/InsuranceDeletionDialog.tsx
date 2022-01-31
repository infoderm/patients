import React from 'react';

import TagDeletionDialog from '../tags/TagDeletionDialog';
import {deleteInsurance} from '../../api/insurances';

interface Props {
	open: boolean;
	onClose: () => void;
	tag: {};
}

const InsuranceDeletionDialog = ({open, onClose, tag}: Props) => {
	return (
		<TagDeletionDialog
			open={open}
			title="insurance"
			endpoint={deleteInsurance}
			tag={tag}
			onClose={onClose}
		/>
	);
};

export default InsuranceDeletionDialog;
