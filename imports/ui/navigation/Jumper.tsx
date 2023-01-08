import React, {type Key} from 'react';
import {Link} from 'react-router-dom';

import {styled} from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

const Buttons = styled('div')(({theme}) => ({
	paddingBottom: theme.spacing(3),
	textAlign: 'center',
}));

const UnstyledLinkButton = ({to, ...rest}) => {
	return <MuiButton component={Link} to={to} {...rest} />;
};

const LinkButton = styled(UnstyledLinkButton)(({theme}) => ({
	margin: theme.spacing(1),
}));

type Item<K> = {
	key: K;
	url: string;
	disabled: boolean;
};

type Props<K> = {
	items: Array<Item<K>>;
};

const Jumper = <K extends Key>({items}: Props<K>) => {
	return (
		<Buttons>
			{items.map(({key, url, disabled}) => (
				<LinkButton key={key} variant="outlined" to={url} disabled={disabled}>
					{key}
				</LinkButton>
			))}
		</Buttons>
	);
};

export default Jumper;
