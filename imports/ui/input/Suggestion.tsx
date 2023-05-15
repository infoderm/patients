import React from 'react';

import MenuItem, {type MenuItemProps} from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Keyboard from '../accessibility/Keyboard';

export const SuggestionItemText = styled(ListItemText)(({theme}) => ({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	marginRight: theme.spacing(1),
}));

type SuggestionProps<Item> = {
	highlightedIndex: number;
	index: number;
	item: Item;
	selectedItems: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => React.ReactNode;
	Item?: React.ElementType;
} & Omit<MenuItemProps, 'ref'>;

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
				{Item ? (
					<Item item={item} />
				) : (
					<>
						<SuggestionItemText>{itemToString(item)}</SuggestionItemText>
						{isHighlighted ? <Keyboard>Enter</Keyboard> : null}
					</>
				)}
			</MenuItem>
		);
	},
);

export default Suggestion;
