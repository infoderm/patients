import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import {myEncodeURIComponent} from '../../client/uri.js';
import useDocumentVersions from './useDocumentVersions.js';

const useStyles = makeStyles((theme) => ({
	chip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#bbb'
	}
}));

const DocumentVersionsChip = ({document, ...rest}) => {
	const classes = useStyles();

	const {loading, versions} = useDocumentVersions(document);

	if (loading || versions.length <= 1) return null;

	const {identifier, reference, lastVersion} = document;

	return (
		<Chip
			icon={<DynamicFeedIcon />}
			label={lastVersion ? `${versions.length} versions` : 'old version'}
			className={classes.chip}
			component={Link}
			to={`/document/versions/${myEncodeURIComponent(
				identifier
			)}/${myEncodeURIComponent(reference)}`}
			{...rest}
		/>
	);
};

DocumentVersionsChip.propTypes = {
	document: PropTypes.object.isRequired
};

export default DocumentVersionsChip;
