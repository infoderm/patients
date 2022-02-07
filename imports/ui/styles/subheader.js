import makeStyles from '@mui/styles/makeStyles';

export default makeStyles(() => ({
	container: {
		backgroundColor: 'white',
		position: 'fixed',
		top: '76px',
		paddingTop: '0.4em',
		zIndex: 10,
		marginLeft: '-24px',
		marginRight: '-24px',
		boxShadow:
			'0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
	},
	avatar: {
		width: '48px',
		height: '48px',
	},
}));
