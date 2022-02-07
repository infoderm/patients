import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import Button from '@mui/material/Button';

import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import {myEncodeURIComponent} from '../../../util/uri';
import useDocumentVersions from '../useDocumentVersions';

const DocumentVersionsButton = ({document, ...rest}) => {
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

DocumentVersionsButton.propTypes = {
	document: PropTypes.object.isRequired,
};

export default DocumentVersionsButton;
