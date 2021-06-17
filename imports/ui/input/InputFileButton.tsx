import React, {useRef} from 'react';
import PropTypes, {InferProps} from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
	container: {
		display: 'inline'
	}
}));

const InputFileButton = ({
	onChange,
	Button,
	...rest
}: InferProps<typeof InputFileButton.propTypes>) => {
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
};

InputFileButton.defaultProps = {
	Button
};

InputFileButton.propTypes = {
	onChange: PropTypes.func.isRequired,
	Button: PropTypes.elementType
};

export default InputFileButton;
