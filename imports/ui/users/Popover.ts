import {makeStyles} from '@material-ui/core/styles';

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
