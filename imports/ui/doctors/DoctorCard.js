import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';

import TagCard from '../tags/TagCard.js';
import withItem from '../tags/withItem.js';

import PatientChip from '../patients/PatientChip.js';
import DoctorDeletionDialog from './DoctorDeletionDialog.js';
import DoctorRenamingDialog from './DoctorRenamingDialog.js';

import {Patients} from '../../api/patients.js';
import {Doctors, doctors} from '../../api/doctors.js';

import {myEncodeURIComponent} from '../../client/uri.js';

const styles = () => ({
	avatar: {
		color: '#fff',
		backgroundColor: blue[500]
	}
});

const DoctorCard = ({classes, item, name, loading}) => {
	if (loading) {
		return '...Loading';
	}

	if (item === undefined) {
		return `Doctor ${name} does not exist`;
	}

	return (
		<TagCard
			tag={item}
			collection={Patients}
			statsCollection={doctors.cache.Stats}
			subscription={doctors.options.parentPublication}
			statsSubscription={doctors.options.parentPublicationStats}
			selector={{doctors: item.name}}
			options={{fields: PatientChip.projection}}
			limit={1}
			url={(name) => `/doctor/${myEncodeURIComponent(name)}`}
			subheader={({count}) =>
				count === undefined ? '...' : `soigne ${count} patients`
			}
			content={({count}, patients) =>
				patients === undefined ? (
					'...'
				) : (
					<div>
						{patients.map((patient) => (
							<PatientChip key={patient._id} patient={patient} />
						))}
						{count > patients.length && (
							<Chip label={`+ ${count - patients.length}`} />
						)}
					</div>
				)
			}
			avatar={<Avatar className={classes.avatar}>Dr</Avatar>}
			DeletionDialog={DoctorDeletionDialog}
			RenamingDialog={DoctorRenamingDialog}
		/>
	);
};

DoctorCard.propTypes = {
	classes: PropTypes.object.isRequired,
	item: PropTypes.object
};

const DoctorCardWithoutItem = withStyles(styles, {withTheme: true})(DoctorCard);

export default DoctorCardWithoutItem;

const DoctorCardWithItem = withItem(
	Doctors,
	doctors.options.singlePublication
)(DoctorCardWithoutItem);

export {DoctorCardWithoutItem, DoctorCardWithItem};
