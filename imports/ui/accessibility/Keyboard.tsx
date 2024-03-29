import {styled} from '@mui/material/styles';

const Keyboard = styled('kbd')({
	backgroundColor: '#eee',
	borderRadius: '3px',
	border: '1px solid #b4b4b4',
	boxShadow:
		'0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset',
	color: '#333',
	display: 'inline-block',
	fontSize: '.85em',
	fontWeight: 700,
	lineHeight: 1,
	padding: '2px 4px',
	whiteSpace: 'nowrap',
});

export default Keyboard;
