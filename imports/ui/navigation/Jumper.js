import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	buttons: {
		paddingBottom: theme.spacing(3),
		textAlign: 'center'
	},
	button: {
		margin: theme.spacing(1)
	}
}));

export default function Jumper({items}) {
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
}

Jumper.propTypes = {
	items: PropTypes.array.isRequired
};
