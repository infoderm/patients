import React from 'react';
import classNames from 'classnames';

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import {type UseComboboxGetItemPropsOptions} from 'downshift';
import Suggestion from './Suggestion';
import CreateItemSuggestion from './CreateItemSuggestion';

type SuggestionsProps<Item> = {
	className?: string;
	hide?: boolean;
	loading?: boolean;
	suggestions: Item[];
	highlightedIndex?: number;
	createNewItem?: () => void;
	inputValue: string;
	error?: boolean;
	selectedItems: Item[];
	itemToKey: (item: Item) => React.Key;
	itemToString: (item: Item) => React.ReactNode;
	getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
	Item?: React.ElementType;
};

const PREFIX = 'Suggestions';

const classes = {
	root: `${PREFIX}-root`,
	hidden: `${PREFIX}-hidden`,
	list: `${PREFIX}-list`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
	[`&.${classes.root}`]: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	[`&.${classes.hidden}`]: {
		display: 'none',
	},
	[`& .${classes.list}`]: {
		padding: 0,
		margin: 0,
	},
}));

const Suggestions = React.forwardRef(
	<ItemType,>(
		{
			className,
			hide = false,
			loading = false,
			suggestions,
			getItemProps,
			createNewItem = undefined,
			inputValue,
			error = false,
			highlightedIndex,
			selectedItems,
			itemToKey,
			itemToString,
			Item,
			...rest
		}: SuggestionsProps<ItemType>,
		ref: React.Ref<HTMLDivElement>,
	) => {
		const createItemSuggestion = createNewItem && !error && inputValue;
		return (
			<StyledPaper
				ref={ref}
				square
				className={classNames(classes.root, {
					[classes.hidden]:
						hide || (!suggestions?.length && !createItemSuggestion),
				})}
			>
				<ul className={classNames(className, classes.list)} {...rest}>
					{!hide && (
						<>
							{createItemSuggestion && (
								<CreateItemSuggestion
									inputValue={inputValue}
									highlightedIndex={highlightedIndex}
									onClick={createNewItem}
								/>
							)}
							{suggestions?.map((item, index) => (
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
						</>
					)}
				</ul>
			</StyledPaper>
		);
	},
);

export default Suggestions;
