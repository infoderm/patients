import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({
	root: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0
	},
	hidden: {
		display: 'none'
	}
});

function renderSuggestion({
	loading,
	suggestion,
	index,
	getItemProps,
	highlightedIndex,
	selectedItem,
	itemToString,
	itemToKey
}) {
	const isHighlighted = highlightedIndex === index;
	const isSelected = (Array.isArray(selectedItem)
		? selectedItem
		: selectedItem
		? [selectedItem]
		: []
	)
		.map(itemToKey)
		.includes(itemToKey(suggestion));

	return (
		<MenuItem
			{...getItemProps({item: suggestion})}
			key={itemToKey(suggestion)}
			selected={isHighlighted}
			disabled={loading}
			component="div"
			style={{
				fontWeight: isSelected ? 500 : 400
			}}
		>
			{itemToString(suggestion)}
		</MenuItem>
	);
}

renderSuggestion.propTypes = {
	highlightedIndex: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	getItemProps: PropTypes.func.isRequired,
	suggestion: PropTypes.object.isRequired
};

class Suggestions extends React.Component {
	render() {
		const {
			classes,
			hide,
			loading,
			suggestions,
			getItemProps,
			highlightedIndex,
			selectedItem,
			itemToKey,
			itemToString,
			...rest
		} = this.props;

		return (
			<Paper
				square
				className={classNames(classes.root, {
					[classes.hidden]: hide || !suggestions?.length
				})}
			>
				<div {...rest}>
					{!hide &&
						suggestions?.map((suggestion, index) =>
							renderSuggestion({
								loading,
								suggestion,
								index,
								getItemProps,
								highlightedIndex,
								selectedItem,
								itemToString,
								itemToKey
							})
						)}
				</div>
			</Paper>
		);
	}
}

Suggestions.defaultProps = {
	hide: false,
	loading: false
};

Suggestions.propTypes = {
	classes: PropTypes.object.isRequired,
	hide: PropTypes.bool,
	loading: PropTypes.bool,
	suggestions: PropTypes.array.isRequired,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
	itemToKey: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired
};

export default withStyles(styles)(Suggestions);
