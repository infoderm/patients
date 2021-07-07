import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
	suggestions: {
		position: 'absolute',
		marginTop: theme.spacing(1),
		left: 0,
		right: 0
	}
}));

export default function SearchBoxInternalsSuggestions(props) {
	const {
		suggestions,
		itemToKey,
		itemToString,
		getItemProps,
		selectedItem,
		highlightedIndex
	} = props;

	const classes = useStyles();

	return (
		<Paper square className={classes.suggestions}>
			{suggestions.results.map((item, index) => (
				<MenuItem
					key={itemToKey(item)}
					{...getItemProps({
						item,
						index,
						disabled: suggestions.loading,
						selected: highlightedIndex === index,
						style: {
							fontWeight: selectedItem === item ? 500 : 400
						}
					})}
				>
					{itemToString(item)}
				</MenuItem>
			))}
		</Paper>
	);
}

SearchBoxInternalsSuggestions.propTypes = {
	suggestions: PropTypes.object.isRequired,
	itemToString: PropTypes.func.isRequired,
	itemToKey: PropTypes.func.isRequired,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number
};
