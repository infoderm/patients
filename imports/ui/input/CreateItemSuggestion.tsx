import React from 'react';

import {styled} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import ListItemIcon from '@mui/material/ListItemIcon';
import Keyboard from '../accessibility/Keyboard';
import {SuggestionItemText} from './Suggestion';

const CreateItemSuggestionValue = styled('span')({
	backgroundColor: 'rgba(255 255 0 / 0.6)',
	padding: '0px 3px',
	borderRadius: 2,
});

type NewItemSuggestionProps = {
	inputValue?: string;
	highlightedIndex?: number;
	onClick?: () => void;
};

const CreateItemSuggestion = React.forwardRef(
	(
		{inputValue, highlightedIndex, onClick}: NewItemSuggestionProps,
		ref: React.Ref<HTMLLIElement>,
	) => {
		return (
			<MenuItem ref={ref} onClick={onClick}>
				<ListItemIcon>
					<AddIcon fontSize="small" />
				</ListItemIcon>
				<SuggestionItemText>
					Create{' '}
					<CreateItemSuggestionValue>{inputValue}</CreateItemSuggestionValue>
				</SuggestionItemText>
				{highlightedIndex === -1 ? <Keyboard>Enter</Keyboard> : null}
			</MenuItem>
		);
	},
);

export default CreateItemSuggestion;
