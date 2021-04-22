import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import colorizeText from '../../client/colorizeText';

const ColorizedTextarea = (props) => {
	const {
		readOnly,
		label,
		placeholder,
		rows,
		rowsMax,
		className,
		value,
		margin,
		onChange,
		dict,
		...rest
	} = props;

	if (readOnly) {
		return (
			<div className={className}>
				{label && <InputLabel shrink>{label}</InputLabel>}
				<Typography style={{whiteSpace: 'pre-wrap'}}>
					{colorizeText(dict, value)}
				</Typography>
			</div>
		);
	}

	return (
		<TextField
			multiline
			className={className}
			label={label}
			value={value}
			placeholder={placeholder}
			rows={rows}
			rowsMax={rowsMax}
			margin={margin}
			onChange={onChange}
			{...rest}
		/>
	);
};

export default ColorizedTextarea;
