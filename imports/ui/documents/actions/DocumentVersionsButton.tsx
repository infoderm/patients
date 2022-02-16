import React from 'react';

import {Link} from 'react-router-dom';

import Button, {ButtonProps} from '@mui/material/Button';

import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import {myEncodeURIComponent} from '../../../util/uri';
import useDocumentVersions from '../useDocumentVersions';
import {DocumentDocument} from '../../../api/collection/documents';

interface DocumentVersionsButtonProps
	extends Omit<ButtonProps<typeof Link>, 'component' | 'to'> {
	document: DocumentDocument;
}

const DocumentVersionsButton = ({
	document,
	...rest
}: DocumentVersionsButtonProps) => {
	const {loading, versions} = useDocumentVersions(document);

	if (loading || versions.length <= 1) return null;

	const {identifier, reference} = document;

	return (
		<Button
			color="primary"
			component={Link}
			to={`/document/versions/${myEncodeURIComponent(
				identifier,
			)}/${myEncodeURIComponent(reference)}`}
			{...rest}
		>
			{versions.length} versions
			<DynamicFeedIcon />
		</Button>
	);
};

export default DocumentVersionsButton;
