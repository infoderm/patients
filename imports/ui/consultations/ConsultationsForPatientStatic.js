import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import AddCommentIcon from '@material-ui/icons/AddComment';

import NoContent from '../navigation/NoContent.js';

import ConsultationCard from '../consultations/ConsultationCard.js';

export default function ConsultationsForPatientStatic({
	classes,
	patientId,
	consultations,
	page,
	...rest
}) {
	return (
		<>
			{consultations.length === 0 && (
				<NoContent>Nothing to see on page {page}.</NoContent>
			)}
			<div {...rest}>
				{consultations.map((consultation, i) => (
					<ConsultationCard
						key={consultation._id}
						consultation={consultation}
						patientChip={false}
						defaultExpanded={!i}
					/>
				))}
				<Button
					className={classes.button}
					color="default"
					component={Link}
					to={`/new/consultation/for/${patientId}`}
				>
					Create a new consultation
					<AddCommentIcon className={classes.rightIcon} />
				</Button>
			</div>
		</>
	);
}

ConsultationsForPatientStatic.propTypes = {
	classes: PropTypes.object.isRequired,
	patientId: PropTypes.string.isRequired,
	consultations: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired
};
