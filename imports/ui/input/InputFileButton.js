import React, {useRef} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
	container: {
		display: 'inline'
	}
}));

export default function InputFileButton({onChange, Button, ...rest}) {
	const classes = useStyles();
	const ref = useRef(null);

	return (
		<div className={classes.container}>
			<Button {...rest} onClick={() => ref.current.click()} />
			<input
				ref={ref}
				multiple
				style={{display: 'none'}}
				type="file"
				onChange={onChange}
			/>
		</div>
	);
}

InputFileButton.defaultProps = {
	Button
};

InputFileButton.propTypes = {
	Button: PropTypes.elementType
};
