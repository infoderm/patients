import React from 'react';

import {styled} from '@mui/material/styles';

import {useTransition, animated} from 'react-spring';
import CardMedia, {type CardMediaProps} from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'AnimatedCardMedia';

const classes = {
	item: `${PREFIX}-item`,
};

const Root = styled('div')({
	[`& .${classes.item}`]: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
});

type AnimatedCardMediaProps = {
	readonly loading: boolean;
	readonly image: string;
	readonly placeholder?: React.ReactNode;
} & Omit<CardMediaProps<typeof animated.div>, 'placeholder'>;

const AnimatedCardMedia = ({
	className,
	loading,
	image,
	placeholder,
	...rest
}: AnimatedCardMediaProps) => {
	const transition = useTransition(image, {
		key: image === undefined ? 'placeholder' : `photo-${image}`,
		from: {opacity: 0},
		enter: {opacity: 1},
		leave: {opacity: 0},
	});

	return (
		<Root className={className} sx={{position: 'relative'}}>
			{transition((style, item) => {
				const children =
					(!loading && item !== '') || placeholder === undefined ? (
						<CardMedia
							component={animated.div}
							className={classes.item}
							image={item}
							style={style as unknown as React.CSSProperties}
							{...rest}
						/>
					) : (
						<animated.div className={classes.item} style={style}>
							{placeholder}
						</animated.div>
					);

				return loading ? (
					<Skeleton variant="rectangular" width="100%">
						{children}
					</Skeleton>
				) : (
					children
				);
			})}
		</Root>
	);
};

export default AnimatedCardMedia;
