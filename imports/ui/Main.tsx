import {styled} from '@mui/material/styles';

const Main = styled('main')(({theme}) => ({
	backgroundColor: theme.palette.background.default,
	overflow: 'hidden',
	flexGrow: 1,
	padding: theme.spacing(3),
	paddingBottom: theme.spacing(13),
	marginTop: 48,
	[theme.breakpoints.up('sm')]: {
		marginTop: 64,
	},
}));

export default Main;
