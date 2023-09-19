import React from 'react';
import {styled} from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import {
	type GetPropsCommonOptions,
	type UseComboboxGetItemPropsOptions,
	type UseComboboxGetMenuPropsOptions,
} from 'downshift';

const Menu = styled(Paper)(({theme}) => ({
	position: 'absolute',
	marginTop: theme.spacing(1),
	left: 0,
	right: 0,
}));

const MenuItemText = styled('span')({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

type SearchBoxInternalsSuggestionsProps<Item> = {
	readonly isOpen: boolean;
	readonly loading: boolean;
	readonly suggestions: Item[];
	readonly itemToKey: (item: Item) => React.Key;
	readonly itemToString: (item: Item) => string;
	readonly getMenuProps: (
		options?: UseComboboxGetMenuPropsOptions,
		otherOptions?: GetPropsCommonOptions,
	) => any;
	readonly getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
	readonly highlightedIndex?: number;
	readonly selectedItem: Item | null;
};

const SearchBoxInternalsSuggestions = <Item,>({
	isOpen,
	loading,
	suggestions,
	itemToKey,
	itemToString,
	getMenuProps,
	getItemProps,
	selectedItem,
	highlightedIndex,
}: SearchBoxInternalsSuggestionsProps<Item>) => {
	return (
		<Menu square {...getMenuProps()}>
			{isOpen &&
				suggestions.map((item, index) => (
					<MenuItem
						key={itemToKey(item)}
						{...getItemProps({
							item,
							index,
							disabled: loading,
							selected: highlightedIndex === index,
							style: {
								fontWeight: selectedItem === item ? 500 : 400,
							},
						})}
					>
						<MenuItemText>{itemToString(item)}</MenuItemText>
					</MenuItem>
				))}
		</Menu>
	);
};

export default SearchBoxInternalsSuggestions;
