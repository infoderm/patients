import React, {useMemo} from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import colorizeText from '../../client/colorizeText';

const ReadOnlyColorizedTextArea = (props) => {
	const {className, label, rowsMax, dict, value} = props;

	const children = useMemo(() => colorizeText(dict, value), [dict, value]);

	return (
		<div className={className}>
			{label && <InputLabel shrink>{label}</InputLabel>}
			<Typography
				style={{
					maxHeight: rowsMax ? `${1.5 * rowsMax}rem` : undefined,
					whiteSpace: 'pre-wrap',
					overflowWrap: 'break-word'
				}}
			>
				{children}
			</Typography>
		</div>
	);
};

const ColorizedTextarea = (props) => {
	const {readOnly, dict, placeholder, rows, margin, onChange, ...common} =
		props;

	if (readOnly) {
		return <ReadOnlyColorizedTextArea dict={dict} {...common} />;
	}

	return (
		<TextField
			multiline
			placeholder={placeholder}
			rows={rows}
			margin={margin}
			onChange={onChange}
			{...common}
		/>
	);
};

export default ColorizedTextarea;
