import React, {useMemo} from 'react';

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type PropsOf from '../../util/types/PropsOf';

import colorizeText from '../text/colorizeText';

type ReadOnlyColorizedTextAreaProps = {
	readonly className?: string;
	readonly label?: string;
	readonly maxRows?: number;
	readonly dict: null | ((piece: string) => boolean);
	readonly value: string;
};

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
		readonly readOnly: boolean;
		readonly placeholder?: string;
		readonly rows?: number;
		readonly margin?: 'none' | 'dense' | 'normal';
		readonly onChange?: (e: any) => void;
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
