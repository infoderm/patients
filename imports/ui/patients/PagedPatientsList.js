import React from 'react';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Paginator from '../navigation/Paginator.js';

import StaticPatientCard from './StaticPatientCard.js';

export default function PagedPatientsList({root, page, perpage, items}) {
	return (
		<>
			<div>
				<Grid container spacing={3}>
					{items.map((patient) => (
						<StaticPatientCard key={patient._id} patient={patient} />
					))}
				</Grid>
			</div>
			<Paginator page={page} end={items.length < perpage} root={root} />
		</>
	);
}

PagedPatientsList.propTypes = {
	root: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired
};
