import React from 'react';

import LinkOffIcon from '@material-ui/icons/LinkOff';
import CancelIcon from '@material-ui/icons/Cancel';

import unlink from '../../api/endpoint/documents/unlink';

import EndpointCallConfirmationDialog from '../modal/EndpointCallConfirmationDialog';
import withLazyOpening from '../modal/withLazyOpening';

interface Props {
	open: boolean;
	onClose: () => void;
	document: {_id: string};
}

const DocumentUnlinkingDialog = ({open, onClose, document}: Props) => {
	return (
		<EndpointCallConfirmationDialog
			open={open}
			title={`Unlink document ${document._id.toString()}`}
			text="If you do not want to unlink this document, click cancel. If you really want to unlink this document from its patient, click the unlink button."
			cancel="Cancel"
			CancelIcon={CancelIcon}
			cancelColor="default"
			confirm="Unlink"
			ConfirmIcon={LinkOffIcon}
			confirmColor="secondary"
			endpoint={unlink}
			args={[document._id]}
			onClose={onClose}
		/>
	);
};

export default withLazyOpening(DocumentUnlinkingDialog);
