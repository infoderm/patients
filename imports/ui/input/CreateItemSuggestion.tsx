import React from 'react';

import {styled} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Keyboard from '../accessibility/Keyboard';

const PREFIX = 'NewItemSuggestion';

const classes = {
	root: `${PREFIX}-root`,
	value: `${PREFIX}-value`,
	text: `${PREFIX}-text`,
};

const StyledMenuItem = styled(MenuItem)(({theme}) => ({
	[`&.${classes.root}`]: {
		backgroundColor: '#ddd',
	},
	[`& .${classes.value}`]: {
		backgroundColor: 'yellow',
		padding: '0px 3px',
		borderRadius: 2,
	},
	[`& .${classes.text}`]: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginRight: theme.spacing(1),
	},
}));

type NewItemSuggestionProps = {
	inputValue?: string;
	highlightedIndex?: number;
	onClick?: () => void;
};

const CreateItemSuggestion = React.forwardRef(
	(
		{inputValue, highlightedIndex, onClick}: NewItemSuggestionProps,
		ref: React.Ref<HTMLLIElement>,
	) => {
		return (
			<StyledMenuItem ref={ref} className={classes.root} onClick={onClick}>
				<ListItemIcon>
					<AddIcon fontSize="small" />
				</ListItemIcon>
				<ListItemText className={classes.text}>
					Create <span className={classes.value}>{inputValue}</span>
				</ListItemText>
				{highlightedIndex === -1 ? <Keyboard>Enter</Keyboard> : null}
			</StyledMenuItem>
		);
	},
);

export default CreateItemSuggestion;
