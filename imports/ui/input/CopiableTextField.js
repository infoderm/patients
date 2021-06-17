import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import TextField from './TextField.js';

import useSaveTextToClipboardAndNotify from './useSaveTextToClipboardAndNotify.js';

const CopiableTextField = (props) => {
	const {value, readOnly} = props;
	const copyValueToClipboard = useSaveTextToClipboardAndNotify(value);

	return (
		<TextField
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
				)
			}}
			{...props}
			value={readOnly ? value || '?' : value}
		/>
	);
};

export default CopiableTextField;
