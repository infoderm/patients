import React from 'react';

import Grid from '@mui/material/Grid';

import type PropsOf from '../../lib/types/PropsOf';

import {type TagNameFields, type TagMetadata} from '../../api/tags/TagDocument';

type TagGridProps = {
	Card: React.ElementType;
	tags: Array<TagNameFields & TagMetadata>;
} & PropsOf<typeof Grid>;

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
