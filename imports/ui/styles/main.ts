import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
	main: {
		backgroundColor: theme.palette.background.default,
		overflow: 'hidden',
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingBottom: theme.spacing(13),
		marginTop: 48,
		[theme.breakpoints.up('sm')]: {
			marginTop: 64,
		},
	},
}));
