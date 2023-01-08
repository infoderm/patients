import React, {type ErrorInfo} from 'react';
import {styled} from '@mui/material/styles';

const PREFIX = 'ErrorLog';

const classes = {
	details: `${PREFIX}-details`,
	summary: `${PREFIX}-summary`,
	pre: `${PREFIX}-pre`,
};

const Details = styled('details')(() => ({
	[`&.${classes.details}`]: {
		padding: '1em',
	},

	[`& .${classes.summary}`]: {
		fontSize: '2em',
		cursor: 'pointer',
		color: '#d44',
	},

	[`& .${classes.pre}`]: {
		whiteSpace: 'pre-wrap',
		backgroundColor: '#333',
		color: '#ccc',
		padding: '1.5em',
		borderRadius: '.5em',
		textTransform: 'initial',
	},
}));

type ErrorLogProps = {
	error: Error;
	errorInfo: ErrorInfo;
};

const ErrorLog = ({error, errorInfo}: ErrorLogProps) => {
	const title = error.toString();
	const description = errorInfo.componentStack;
	return (
		<Details className={classes.details}>
			<summary className={classes.summary}>Show error log</summary>
			<pre className={classes.pre}>
				{title}
				<br />
				{description}
			</pre>
		</Details>
	);
};

export default ErrorLog;
