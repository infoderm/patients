import React, {useCallback} from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import TextField from './TextField';

import useSaveTextToClipboardAndNotify from './useSaveTextToClipboardAndNotify';

const CopiableTextField = (props) => {
	const {value, placeholder, readOnly, InputLabelProps, InputProps} = props;
	const saveTextToClipboard = useSaveTextToClipboardAndNotify();
	const copyValueToClipboard = useCallback(
		() => saveTextToClipboard(value),
		[saveTextToClipboard, value],
	);

	return (
		<TextField
			{...props}
			InputLabelProps={{
				shrink: Boolean(readOnly && placeholder !== undefined) || undefined,
				...InputLabelProps,
			}}
			InputProps={{
				endAdornment: readOnly && value && (
					<InputAdornment position="end">
						<IconButton
							size="large"
							aria-label="copy"
							onClick={copyValueToClipboard}
							onMouseDown={(e) => e.preventDefault()}
						>
							<FileCopyIcon />
						</IconButton>
					</InputAdornment>
				),
				...InputProps,
			}}
		/>
	);
};

export default CopiableTextField;
