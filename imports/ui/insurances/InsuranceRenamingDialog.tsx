import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameInsurance, useInsurancesFind} from '../../api/insurances';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: {};
}

const InsuranceRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="insurance"
			useTagsFind={useInsurancesFind}
			endpoint={renameInsurance}
			tag={tag}
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default InsuranceRenamingDialog;
