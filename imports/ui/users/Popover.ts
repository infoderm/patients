import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
	popover: {
		display: 'flex',
	},
	row: {
		display: 'block',
		margin: theme.spacing(1),
		width: 200,
	},
	form: {
		display: 'block',
	},
}));
