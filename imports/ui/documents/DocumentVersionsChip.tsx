import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';

import Chip from '@mui/material/Chip';

import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import {myEncodeURIComponent} from '../../util/uri';
import useDocumentVersions from './useDocumentVersions';

const useStyles = makeStyles((theme) => ({
	chip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#bbb',
	},
}));

const DocumentVersionsChip = ({document, className, ...rest}) => {
	const classes = useStyles();

	const {loading, versions} = useDocumentVersions(document);

	if (loading || versions.length <= 1) return null;

	const {identifier, reference, lastVersion} = document;

	return (
		<Chip
			icon={<DynamicFeedIcon />}
			label={lastVersion ? `${versions.length} versions` : 'old version'}
			className={classNames(classes.chip, className)}
			component={Link}
			to={`/document/versions/${myEncodeURIComponent(
				identifier,
			)}/${myEncodeURIComponent(reference)}`}
			{...rest}
		/>
	);
};

DocumentVersionsChip.propTypes = {
	document: PropTypes.object.isRequired,
	className: PropTypes.string,
};

export default DocumentVersionsChip;
