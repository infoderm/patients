import React from 'react';

import {Link} from 'react-router-dom';

import Button, {type ButtonProps} from '@mui/material/Button';

import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import {myEncodeURIComponent} from '../../../util/uri';
import useDocumentVersions from '../useDocumentVersions';
import {type DocumentDocument} from '../../../api/collection/documents';

type DocumentVersionsButtonProps = {
	readonly document: DocumentDocument;
} & Omit<ButtonProps<typeof Link>, 'component' | 'to'>;

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
				identifier!,
			)}/${myEncodeURIComponent(reference!)}`}
			{...rest}
		>
			{versions.length} versions
			<DynamicFeedIcon />
		</Button>
	);
};

export default DocumentVersionsButton;
