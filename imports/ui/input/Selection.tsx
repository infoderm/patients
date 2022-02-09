import React from 'react';

import {styled} from '@mui/material/styles';

import {UseMultipleSelectionGetSelectedItemPropsOptions} from 'downshift';

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

interface SelectionProps<Item, ChipProps> {
	Chip: React.ElementType;
	chipProps: ((item: Item, index: number) => ChipProps) | ChipProps;
	selectedItems: Item[];
	itemToString: (item: Item) => string;
	getSelectedItemProps: (
		options: UseMultipleSelectionGetSelectedItemPropsOptions<Item>,
	) => any;
	readOnly: boolean;
	removeSelectedItem: (item: Item) => void | Promise<void>;
}

const Selection = React.memo(
	({
		Chip,
		chipProps,
		selectedItems,
		itemToString,
		getSelectedItemProps,
		readOnly,
		removeSelectedItem,
	}: SelectionProps<any, any>) => {
		const handleDelete = (item) => async () => {
			await removeSelectedItem(item);
		};

		const onClick = (e) => {
			e.stopPropagation();
		};

		return (
			<Root>
				{selectedItems.map((item, index) => (
					<Chip
						key={itemToString(item)}
						{...(chipProps instanceof Function
							? chipProps(item, index)
							: chipProps)}
						tabIndex={-1}
						label={itemToString(item)}
						className={classes.chip}
						onDelete={readOnly ? undefined : handleDelete(item)}
						{...getSelectedItemProps({selectedItem: item, index, onClick})}
					/>
				))}
			</Root>
		);
	},
);

export default Selection;
