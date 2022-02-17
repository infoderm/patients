import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

const DialogWithVisibleOverflow = styled(Dialog)({
	[`& .MuiDialog-paper`]: {
		overflow: 'visible',
	},
	[`& .MuiDialogContent-root`]: {
		overflow: 'visible',
	},
});

export default DialogWithVisibleOverflow;
