import React from 'react';

import MenuItem, {MenuItemProps} from '@mui/material/MenuItem';

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
			<MenuItem
				ref={ref}
				{...rest}
				selected={isHighlighted}
				style={{
					fontWeight: isSelected ? 500 : 400,
				}}
			>
				{Item ? <Item item={item} /> : itemToString(item)}
			</MenuItem>
		);
	},
);

export default Suggestion;
