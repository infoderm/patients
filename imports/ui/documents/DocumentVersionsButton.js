import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';

import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import {myEncodeURIComponent} from '../../client/uri.js';
import useDocumentVersions from './useDocumentVersions.js';

const DocumentVersionsButton = ({document, ...rest}) => {
	const {loading, versions} = useDocumentVersions(document);

	if (loading || versions.length <= 1) return null;

	const {identifier, reference} = document;

	return (
		<Button
			color="primary"
			component={Link}
			to={`/document/versions/${myEncodeURIComponent(
				identifier
			)}/${myEncodeURIComponent(reference)}`}
			{...rest}
		>
			{versions.length} versions
			<DynamicFeedIcon />
		</Button>
	);
};

DocumentVersionsButton.propTypes = {
	document: PropTypes.object.isRequired
};

export default DocumentVersionsButton;
