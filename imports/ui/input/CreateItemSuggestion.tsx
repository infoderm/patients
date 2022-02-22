import React from 'react';

import {styled} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const PREFIX = 'NewItemSuggestion';

const classes = {
	root: `${PREFIX}-root`,
	value: `${PREFIX}-value`,
	text: `${PREFIX}-text`,
	kbd: `${PREFIX}-kbd`,
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
	[`& .${classes.kbd}`]: {
		backgroundColor: '#eee',
		borderRadius: '3px',
		border: '1px solid #b4b4b4',
		boxShadow:
			'0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset',
		color: '#333',
		display: 'inline-block',
		fontSize: '.85em',
		fontWeight: 700,
		lineHeight: 1,
		padding: '2px 4px',
		whiteSpace: 'nowrap',
	},
}));

interface NewItemSuggestionProps {
	inputValue?: string;
	highlightedIndex?: number;
	onClick?: () => void;
}

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
				{highlightedIndex === -1 ? (
					<kbd className={classes.kbd}>Enter</kbd>
				) : null}
			</StyledMenuItem>
		);
	},
);

export default CreateItemSuggestion;
