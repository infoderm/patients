import React from 'react';
import {useHistory} from 'react-router-dom';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import InputFileButton from '../input/InputFileButton.js';

const DocumentImportButton = ({onImport, children, ...rest}) => {
	const history = useHistory();

	const onChange = (event) => {
		event.persist();
		const files = event.target.files;
		console.debug(files);
		onImport(history, files);
	};

	return (
		<InputFileButton onChange={onChange} {...rest}>
			{children || <CloudUploadIcon />}
		</InputFileButton>
	);
};

export default DocumentImportButton;
