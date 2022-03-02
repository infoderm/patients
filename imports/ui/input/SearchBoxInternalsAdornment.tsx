import {styled} from '@mui/material/styles';

const SearchBoxInternalsAdornment = styled('div')(({theme}) => ({
	display: 'inline-flex',
	width: theme.spacing(9),
	height: '100%',
	position: 'relative',
	pointerEvents: 'none',
	justifyContent: 'center',
}));

export default SearchBoxInternalsAdornment;
