import React, {useRef} from 'react';

import {styled} from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

import PropsOf from '../../util/PropsOf';

const Root = styled('div')({
	display: 'inline',
});

type ComponentWithoutCollidingProps<C> = PropsOf<C> extends
	| {onChange?: unknown}
	| {Button?: unknown}
	| {onClick?: unknown}
	? never
	: C;

interface OwnProps<C> {
	onChange: (event: any) => void;
	Button?: ComponentWithoutCollidingProps<C>;
}

type Props<C> = PropsOf<C> & OwnProps<C>;

const InputFileButton = React.forwardRef(
	<C extends React.ElementType>(
		{onChange, Button = MuiButton, ...rest}: Props<C>,
		ref,
	) => {
		const inputRef = useRef<HTMLInputElement>(null);

		return (
			<Root>
				<Button
					ref={ref}
					{...rest}
					onClick={() => {
						inputRef.current.click();
					}}
				/>
				<input
					ref={inputRef}
					multiple
					style={{display: 'none'}}
					type="file"
					onChange={onChange}
				/>
			</Root>
		);
	},
);

export default InputFileButton;
