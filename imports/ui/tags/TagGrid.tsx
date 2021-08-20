import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

const TagGrid = ({Card, tags, ...rest}) => (
	<Grid container spacing={3} {...rest}>
		{tags.map((tag) => (
			<Grid key={tag._id} item xs={12} sm={12} md={12} lg={6} xl={4}>
				<Card item={tag} />
			</Grid>
		))}
	</Grid>
);

TagGrid.propTypes = {
	Card: PropTypes.elementType.isRequired,
	tags: PropTypes.array.isRequired,
};

export default TagGrid;
