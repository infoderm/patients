import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import {UseMultipleSelectionGetSelectedItemPropsOptions} from 'downshift';

const styles = (theme) => ({
	chip: {
		margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`
	}
});

const useStyles = makeStyles(styles);

interface SelectionProps<Item, ChipProps> {
	Chip: any;
	chipProps: (item: Item, index: number) => ChipProps | ChipProps;
	selectedItems: Item[];
	itemToString: (item: Item) => string;
	getSelectedItemProps: (
		options: UseMultipleSelectionGetSelectedItemPropsOptions<Item>
	) => any;
	readOnly: boolean;
	removeSelectedItem: (item: Item) => void;
}

const Selection = ({
	Chip,
	chipProps,
	selectedItems,
	itemToString,
	getSelectedItemProps,
	readOnly,
	removeSelectedItem
}: SelectionProps<any, any>) => {
	const classes = useStyles();

	const handleDelete = (item) => () => {
		removeSelectedItem(item);
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
					{...getSelectedItemProps({selectedItem: item, index})}
				/>
			))}
		</>
	);
};

export default Selection;
