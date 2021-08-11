import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import TextField from './TextField';

import useSaveTextToClipboardAndNotify from './useSaveTextToClipboardAndNotify';

const CopiableTextField = (props) => {
	const {value, placeholder, readOnly, InputLabelProps, InputProps} = props;
	const copyValueToClipboard = useSaveTextToClipboardAndNotify(value);

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
