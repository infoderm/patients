import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {renameInsurance, useInsurancesFind} from '../../api/insurances';
import TagDocument from '../../api/tags/TagDocument';
import {formattedLineInput} from '../../api/string';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: TagDocument;
}

const InsuranceRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="insurance"
			useTagsFind={useInsurancesFind}
			endpoint={renameInsurance}
			tag={tag}
			inputFormat={formattedLineInput}
			nameKey="displayName"
			nameKeyTitle="display name"
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default InsuranceRenamingDialog;
