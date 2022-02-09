import {styled} from '@mui/material/styles';
import MuiPopover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const Popover = styled(MuiPopover)({
	display: 'flex',
});

const row = ({theme}) => ({
	display: 'block',
	margin: theme.spacing(1),
	width: 200,
});

export const RowTextField = styled(TextField)(row);
export const RowButton = styled(Button)(row);
export const Form = styled('form')({display: 'block'});
