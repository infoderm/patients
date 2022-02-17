import React from 'react';

import Grid from '@mui/material/Grid';
import PropsOf from '../../util/PropsOf';

import {TagFields, TagMetadata} from '../../api/tags/TagDocument';

interface TagGridProps extends PropsOf<typeof Grid> {
	Card: React.ElementType;
	tags: Array<TagFields & TagMetadata>;
}

const TagGrid = ({Card, tags, ...rest}: TagGridProps) => (
	<Grid container spacing={3} {...rest}>
		{tags.map((tag) => (
			<Grid key={tag._id} item xs={12} sm={12} md={12} lg={6} xl={4}>
				<Card item={tag} />
			</Grid>
		))}
	</Grid>
);

export default TagGrid;
