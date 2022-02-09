import React, {useRef} from 'react';

import {styled} from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

import PropsOf from '../../util/PropsOf';

const PREFIX = 'InputFileButton';

const classes = {
	container: `${PREFIX}-container`,
};

const Root = styled('div')(() => ({
	[`&.${classes.container}`]: {
		display: 'inline',
	},
}));

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

const InputFileButton = <C extends React.ElementType>({
	onChange,
	Button = MuiButton,
	...rest
}: Props<C>) => {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<Root className={classes.container}>
			<Button
				{...rest}
				onClick={() => {
					ref.current.click();
				}}
			/>
			<input
				ref={ref}
				multiple
				style={{display: 'none'}}
				type="file"
				onChange={onChange}
			/>
		</Root>
	);
};

export default InputFileButton;
