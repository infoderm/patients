import React from 'react';

import MenuItem, {MenuItemProps} from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Keyboard from '../accessibility/Keyboard';

const PREFIX = 'Suggestion';

const classes = {
	text: `${PREFIX}-text`,
};

const StyledMenuItem = styled(MenuItem)(({theme}) => ({
	[`& .${classes.text}`]: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginRight: theme.spacing(1),
	},
}));

interface SuggestionProps<Item> extends Omit<MenuItemProps<'li'>, 'ref'> {
	highlightedIndex: number;
	index: number;
	item: Item;
	selectedItems: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => string;
	Item?: React.ElementType;
}

const Suggestion = React.forwardRef(
	<ItemType,>(
		{
			item,
			index,
			highlightedIndex,
			selectedItems,
			itemToKey,
			itemToString,
			Item,
			...rest
		}: SuggestionProps<ItemType>,
		ref: React.Ref<HTMLLIElement>,
	) => {
		const isHighlighted = highlightedIndex === index;
		const isSelected = selectedItems.map(itemToKey).includes(itemToKey(item));

		return (
			<StyledMenuItem
				ref={ref}
				{...rest}
				selected={isHighlighted}
				style={{
					fontWeight: isSelected ? 500 : 400,
				}}
			>
				{Item ? (
					<Item item={item} />
				) : (
					<>
						<ListItemText className={classes.text}>
							{itemToString(item)}
						</ListItemText>
						{isHighlighted ? <Keyboard>Enter</Keyboard> : null}
					</>
				)}
			</StyledMenuItem>
		);
	},
);

export default Suggestion;
