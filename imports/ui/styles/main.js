import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	main: {
		backgroundColor: theme.palette.background.default,
		flexGrow: 1,
		padding: theme.spacing(3),
		marginTop: 48,
		[theme.breakpoints.up('sm')]: {
			marginTop: 64
		}
	}
}));
