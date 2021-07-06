import React from 'react';
import PropTypes, {InferProps} from 'prop-types';
import classNames from 'classnames';

import {makeStyles, createStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const SuggestionPropTypes = {
	loading: PropTypes.bool.isRequired,
	highlightedIndex: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	item: PropTypes.any.isRequired,
	selectedItems: PropTypes.array.isRequired,
	itemToKey: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired,
	Item: PropTypes.elementType
};

type SuggestionProps = InferProps<typeof SuggestionPropTypes>;

const Suggestion = React.forwardRef<any, SuggestionProps>(
	(
		{
			loading,
			item,
			index,
			highlightedIndex,
			selectedItems,
			itemToKey,
			itemToString,
			Item,
			...rest
		},
		ref
	) => {
		const isHighlighted = highlightedIndex === index;
		const isSelected = selectedItems.map(itemToKey).includes(itemToKey(item));

		return (
			<MenuItem
				ref={ref}
				{...rest}
				selected={isHighlighted}
				disabled={loading}
				component="div"
				style={{
					fontWeight: isSelected ? 500 : 400
				}}
			>
				{Item ? <Item item={item} /> : itemToString(item)}
			</MenuItem>
		);
	}
);

Suggestion.propTypes = SuggestionPropTypes;

const SuggestionsPropTypes = {
	hide: PropTypes.bool,
	loading: PropTypes.bool,
	suggestions: PropTypes.array.isRequired,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
	selectedItems: PropTypes.array.isRequired,
	itemToKey: PropTypes.func.isRequired,
	itemToString: PropTypes.func.isRequired,
	Item: PropTypes.elementType
};

type SuggestionsProps = InferProps<typeof SuggestionsPropTypes>;

const styles = (theme) =>
	createStyles({
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

const useStyles = makeStyles(styles);

const Suggestions = React.forwardRef<any, SuggestionsProps>(
	(
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
		},
		ref
	) => {
		const classes = useStyles();

		return (
			<Paper
				ref={ref}
				square
				className={classNames(classes.root, {
					[classes.hidden]: hide || !suggestions?.length
				})}
			>
				<div {...rest}>
					{!hide &&
						suggestions?.map((item, index) => (
							<Suggestion
								key={itemToKey(item)}
								{...getItemProps({item, index})}
								loading={loading}
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
	}
);

Suggestions.propTypes = SuggestionsPropTypes;

export default Suggestions;
