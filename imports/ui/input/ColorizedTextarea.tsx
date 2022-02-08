import React, {useMemo} from 'react';

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import PropsOf from '../../util/PropsOf';

import colorizeText from '../text/colorizeText';

interface ReadOnlyColorizedTextAreaProps {
	className?: string;
	label?: string;
	maxRows?: number;
	dict: (piece: string) => boolean;
	value: string;
}

const ReadOnlyColorizedTextArea = ({
	className,
	label,
	maxRows,
	dict,
	value,
}: ReadOnlyColorizedTextAreaProps) => {
	const children = useMemo(() => colorizeText(dict, value), [dict, value]);

	return (
		<div className={className}>
			{label && <InputLabel shrink>{label}</InputLabel>}
			<Typography
				style={{
					maxHeight: maxRows ? `${1.5 * maxRows}rem` : undefined,
					whiteSpace: 'pre-wrap',
					overflowWrap: 'break-word',
				}}
			>
				{children}
			</Typography>
		</div>
	);
};

type ColorizedTextareaProps = ReadOnlyColorizedTextAreaProps &
	PropsOf<typeof TextField> & {
		readOnly: boolean;
		placeholder?: string;
		rows?: number;
		margin?: 'none' | 'dense' | 'normal';
		onChange?: (e: any) => void;
	};

const ColorizedTextarea = ({
	readOnly,
	dict,
	placeholder,
	rows,
	margin,
	onChange,
	...common
}: ColorizedTextareaProps) => {
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
