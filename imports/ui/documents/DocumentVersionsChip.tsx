import React from 'react';

import {Link} from 'react-router-dom';

import Chip, {type ChipProps} from '@mui/material/Chip';

import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import makeStyles from '../styles/makeStyles';

import {myEncodeURIComponent} from '../../lib/uri';
import {type DocumentDocument} from '../../api/collection/documents';
import useDocumentVersions from './useDocumentVersions';

const useStyles = makeStyles()((theme) => ({
	chip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#bbb',
	},
}));

type DocumentVersionsChipProps = {
	document: DocumentDocument;
} & Omit<ChipProps<typeof Link>, 'component' | 'to'>;

const DocumentVersionsChip = ({
	document,
	className,
	...rest
}: DocumentVersionsChipProps) => {
	const {classes, cx} = useStyles();

	const {loading, versions} = useDocumentVersions(document);

	if (loading || versions.length <= 1) return null;

	const {identifier, reference, lastVersion} = document;

	return (
		<Chip
			icon={<DynamicFeedIcon />}
			label={lastVersion ? `${versions.length} versions` : 'old version'}
			className={cx(classes.chip, className)}
			component={Link}
			to={`/document/versions/${myEncodeURIComponent(
				identifier!,
			)}/${myEncodeURIComponent(reference!)}`}
			{...rest}
		/>
	);
};

export default DocumentVersionsChip;
