import React from 'react';
import classNames from 'classnames';

import {makeStyles, createStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';
import MenuItem, {MenuItemProps} from '@mui/material/MenuItem';
import {UseComboboxGetItemPropsOptions} from 'downshift';

interface SuggestionProps<Item> extends Omit<MenuItemProps<'div'>, 'ref'> {
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
		ref: React.Ref<HTMLDivElement>,
	) => {
		const isHighlighted = highlightedIndex === index;
		const isSelected = selectedItems.map(itemToKey).includes(itemToKey(item));

		return (
			<MenuItem
				ref={ref}
				{...rest}
				selected={isHighlighted}
				component="div"
				style={{
					fontWeight: isSelected ? 500 : 400,
				}}
			>
				{Item ? <Item item={item} /> : itemToString(item)}
			</MenuItem>
		);
	},
);

interface SuggestionsProps<Item> {
	hide?: boolean;
	loading?: boolean;
	suggestions: Item[];
	highlightedIndex?: number;
	selectedItems: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => string;
	getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
	Item?: React.ElementType;
}

const styles = (theme) =>
	createStyles({
		root: {
			position: 'absolute',
			zIndex: 1,
			marginTop: theme.spacing(1),
			left: 0,
			right: 0,
		},
		hidden: {
			display: 'none',
		},
	});

const useStyles = makeStyles(styles);

const Suggestions = React.forwardRef(
	<ItemType,>(
		{
			hide = false,
			loading = false,
			suggestions,
			getItemProps,
			highlightedIndex,
			selectedItems,
			itemToKey,
			itemToString,
			Item,
			...rest
		}: SuggestionsProps<ItemType>,
		ref: React.Ref<HTMLDivElement>,
	) => {
		const classes = useStyles();

		return (
			<Paper
				ref={ref}
				square
				className={classNames(classes.root, {
					[classes.hidden]: hide || !suggestions?.length,
				})}
			>
				<div {...rest}>
					{!hide &&
						suggestions?.map((item, index) => (
							<Suggestion
								key={itemToKey(item)}
								{...getItemProps({item, index, disabled: loading})}
								item={item}
								index={index}
								highlightedIndex={highlightedIndex}
								selectedItems={selectedItems}
								itemToKey={itemToKey}
								itemToString={itemToString}
								Item={Item}
							/>
						))}
				</div>
			</Paper>
		);
	},
);

export default Suggestions;
