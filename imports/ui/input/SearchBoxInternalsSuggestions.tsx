import React from 'react';
import {styled} from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import {
	type GetPropsCommonOptions,
	type UseComboboxGetItemPropsOptions,
	type UseComboboxGetMenuPropsOptions,
} from 'downshift';

const PREFIX = 'SearchBoxInternalsSuggestions';

const classes = {
	suggestions: `${PREFIX}-suggestions`,
	itemText: `${PREFIX}-itemText`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
	[`&.${classes.suggestions}`]: {
		position: 'absolute',
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},

	[`& .${classes.itemText}`]: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}));

type SearchBoxInternalsSuggestionsProps<Item> = {
	isOpen: boolean;
	loading: boolean;
	suggestions: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => string;
	getMenuProps: (
		options?: UseComboboxGetMenuPropsOptions,
		otherOptions?: GetPropsCommonOptions,
	) => any;
	getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
	highlightedIndex?: number;
	selectedItem: Item;
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
		<StyledPaper square className={classes.suggestions} {...getMenuProps()}>
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
						<span className={classes.itemText}>{itemToString(item)}</span>
					</MenuItem>
				))}
		</StyledPaper>
	);
};

export default SearchBoxInternalsSuggestions;
