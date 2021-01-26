import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import withDocumentVersions from './withDocumentVersions.js';
import {myEncodeURIComponent} from '../../client/uri.js';

const useStyles = makeStyles((theme) => ({
	chip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#bbb'
	}
}));

const DocumentVersionsChip = ({
	document: {identifier, reference, lastVersion},
	loading,
	versions,
	...rest
}) => {
	const classes = useStyles();

	if (loading || versions.length <= 1) return null;

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
	loading: PropTypes.bool.isRequired,
	versions: PropTypes.array.isRequired
};

const Component = withDocumentVersions(DocumentVersionsChip);

Component.propTypes = {
	...withDocumentVersions.propTypes
};

export default Component;
