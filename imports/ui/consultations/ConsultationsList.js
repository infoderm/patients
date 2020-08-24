import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';

import ReactiveConsultationCard from './ReactiveConsultationCard.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	}
}));

export default function ConsultationsList({
	items,
	itemProps,
	defaultExpandedFirst
}) {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			{items.map((consultation, i) => (
				<ReactiveConsultationCard
					key={consultation._id}
					consultation={consultation}
					defaultExpanded={i === 0 && defaultExpandedFirst}
					{...itemProps}
				/>
			))}
		</div>
	);
}

ConsultationsList.defaultProps = {
	defaultExpandedFirst: false
};

ConsultationsList.propTypes = {
	items: PropTypes.array.isRequired,
	itemProps: PropTypes.object,
	defaultExpandedFirst: PropTypes.bool
};
