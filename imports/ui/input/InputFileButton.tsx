import React, {useRef} from 'react';

import {styled} from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

import type PropsOf from '../../lib/types/PropsOf';
import useUniqueId from '../hooks/useUniqueId';

const Input = styled('input')({
	display: 'none',
});

type ComponentWithoutCollidingProps<C> = PropsOf<C> extends
	| {onChange?: unknown}
	| {Button?: unknown}
	| {onClick?: unknown}
	? never
	: C;

type OwnProps<C> = {
	onChange: (event: any) => void;
	Button?: ComponentWithoutCollidingProps<C>;
};

type Props<C> = PropsOf<C> & OwnProps<C>;

const InputFileButton = React.forwardRef(
	<C extends React.ElementType>(
		{onChange, Button = MuiButton, ...rest}: Props<C>,
		ref,
	) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const id = useUniqueId('input-file-button');
		const inputId = `${id}-input`;

		return (
			<label htmlFor={inputId}>
				<Button
					ref={ref}
					{...rest}
					onClick={() => {
						inputRef.current.click();
					}}
				/>
				<Input
					ref={inputRef}
					multiple
					id={inputId}
					type="file"
					onChange={onChange}
				/>
			</label>
		);
	},
);

export default InputFileButton;
