import React from 'react';

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import {type UseComboboxGetItemPropsOptions} from 'downshift';

import type PropsOf from '../../util/types/PropsOf';

import Suggestion from './Suggestion';
import CreateItemSuggestion from './CreateItemSuggestion';

type SuggestionsProps<Item> = {
	readonly className?: string;
	readonly hide?: boolean;
	readonly loading?: boolean;
	readonly suggestions: Item[];
	readonly highlightedIndex?: number;
	readonly createNewItem?: () => void;
	readonly inputValue: string;
	readonly error?: boolean;
	readonly selectedItems: Item[];
	readonly itemToKey: (item: Item) => React.Key;
	readonly itemToString: (item: Item) => React.ReactNode;
	readonly getItemProps: (options: UseComboboxGetItemPropsOptions<Item>) => any;
	readonly Item?: React.ElementType;
};

const Root = styled(
	React.forwardRef(
		(
			{open, ...rest}: PropsOf<typeof Paper> & {readonly open: boolean},
			ref: React.Ref<HTMLDivElement>,
		) => <Paper ref={ref} square {...rest} />,
	),
)(({theme, open}) => ({
	position: 'absolute',
	zIndex: 1,
	marginTop: theme.spacing(1),
	left: 0,
	right: 0,
	display: open ? 'block' : 'none',
}));

const UnorderedList = styled('ul')({
	padding: 0,
	margin: 0,
});

const Suggestions = React.forwardRef(
	<ItemType,>(
		{
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
		const open = !hide && Boolean(suggestions?.length || createItemSuggestion);
		return (
			<Root ref={ref} open={open}>
				<UnorderedList {...rest}>
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
				</UnorderedList>
			</Root>
		);
	},
);

export default Suggestions;
