import React from 'react';
import PropTypes from 'prop-types';

import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
	suggestions: {
		position: 'absolute',
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	itemText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}));

export default function SearchBoxInternalsSuggestions(props) {
	const {
		isOpen,
		loading,
		suggestions,
		itemToKey,
		itemToString,
		getMenuProps,
		getItemProps,
		selectedItem,
		highlightedIndex,
	} = props;

	const classes = useStyles();

	return (
		<Paper square className={classes.suggestions} {...getMenuProps()}>
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
		</Paper>
	);
}

SearchBoxInternalsSuggestions.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	suggestions: PropTypes.array.isRequired,
	itemToString: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
};
