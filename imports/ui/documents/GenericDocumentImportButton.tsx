import React from 'react';
import {useHistory} from 'react-router-dom';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import InputFileButton from '../input/InputFileButton';

const GenericDocumentImportButton = ({onImport, children, ...rest}) => {
	const history = useHistory();

	const onChange = (event) => {
		event.persist();
		const files = event.target.files;
		console.debug(files);
		onImport(history, files);
	};

	const defaultText = 'Import Document';
	const defaultIcon = <CloudUploadIcon />;
	const computedChildren = children || defaultIcon;

	const extraProps =
		typeof computedChildren === 'string'
			? {endIcon: defaultIcon}
			: {'aria-label': defaultText};

	return (
		<InputFileButton onChange={onChange} {...extraProps} {...rest}>
			{computedChildren}
		</InputFileButton>
	);
};

export default GenericDocumentImportButton;
