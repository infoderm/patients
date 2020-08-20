import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	main: {
		backgroundColor: theme.palette.background.default,
		flexGrow: 1,
		// Width: 'calc(100% - 240px)',
		padding: theme.spacing(3),
		height: 'calc(100% - 56px)',
		marginTop: 56,
		// MarginLeft: 240,
		[theme.breakpoints.up('sm')]: {
			height: 'calc(100% - 64px)',
			marginTop: 64
		}
	}
}));
