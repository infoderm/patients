import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import {UseMultipleSelectionGetSelectedItemPropsOptions} from 'downshift';

const styles = (theme) => ({
	chip: {
		margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
	},
});

const useStyles = makeStyles(styles);

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
		const classes = useStyles();

		const handleDelete = (item) => async () => {
			await removeSelectedItem(item);
		};

		const onClick = (e) => {
			e.stopPropagation();
		};

		return (
			<>
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
			</>
		);
	},
);

export default Selection;
