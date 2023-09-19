import React from 'react';

import {styled} from '@mui/material/styles';

import {type UseMultipleSelectionGetSelectedItemPropsOptions} from 'downshift';

const PREFIX = 'Selection';

const classes = {
	chip: `${PREFIX}-chip`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({theme}) => ({
	[`& .${classes.chip}`]: {
		margin: `${theme.spacing(1 / 2)} ${theme.spacing(1 / 4)}`,
	},
}));

type SelectionProps<Item, ChipProps> = {
	readonly Chip: React.ElementType;
	readonly chipProps: ((item: Item, index: number) => ChipProps) | ChipProps;
	readonly selectedItems: Item[];
	readonly itemToKey: (item: Item) => React.Key;
	readonly itemToString: (item: Item) => React.ReactNode;
	readonly getSelectedItemProps: (
		options: UseMultipleSelectionGetSelectedItemPropsOptions<Item>,
	) => any;
	readonly readOnly: boolean;
	readonly removeSelectedItem: (item: Item) => void | Promise<void>;
};

const Selection = React.memo(
	({
		Chip,
		chipProps,
		selectedItems,
		itemToKey,
		itemToString,
		getSelectedItemProps,
		readOnly,
		removeSelectedItem,
	}: SelectionProps<any, any>) => {
		const handleDelete = (item) => async () => {
			await removeSelectedItem(item);
		};

		return (
			<Root>
				{selectedItems.map((item, index) => (
					<Chip
						key={itemToKey(item)}
						tabIndex={-1}
						item={item}
						label={itemToString(item)}
						className={classes.chip}
						onDelete={readOnly ? undefined : handleDelete(item)}
						{...getSelectedItemProps({
							selectedItem: item,
							index,
							...(chipProps instanceof Function
								? chipProps(item, index)
								: chipProps),
						})}
					/>
				))}
			</Root>
		);
	},
);

export default Selection;
