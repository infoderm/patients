import React, {useRef} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';

import PropsOf from '../../util/PropsOf';

const useStyles = makeStyles(() => ({
	container: {
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
	const classes = useStyles();
	const ref = useRef<HTMLInputElement>(null);

	return (
		<div className={classes.container}>
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
		</div>
	);
};

export default InputFileButton;
