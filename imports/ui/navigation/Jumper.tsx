import React, {Key} from 'react';

import {Link} from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
	buttons: {
		paddingBottom: theme.spacing(3),
		textAlign: 'center',
	},
	button: {
		margin: theme.spacing(1),
	},
}));

interface Item<K> {
	key: K;
	url: string;
	disabled: boolean;
}

interface Props<K> {
	items: Array<Item<K>>;
}

const Jumper = <K extends Key>({items}: Props<K>) => {
	const classes = useStyles();

	return (
		<div className={classes.buttons}>
			{items.map(({key, url, disabled}) => (
				<Button
					key={key}
					className={classes.button}
					variant="outlined"
					component={Link}
					to={url}
					disabled={disabled}
				>
					{key}
				</Button>
			))}
		</div>
	);
};

export default Jumper;
