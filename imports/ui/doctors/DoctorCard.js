import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';

import TagCard from '../tags/TagCard.js';

import PatientChip from '../patients/PatientChip.js';
import DoctorDeletionDialog from './DoctorDeletionDialog.js';
import DoctorRenamingDialog from './DoctorRenamingDialog.js';

import { Patients } from '../../api/patients.js';

const styles = theme => ({
	avatar: {
		color: '#fff',
		backgroundColor: green[500],
	},
});

const NITEMS = 1;

function DoctorCard ( { classes , item } ) {

	return (
		<TagCard
			tag={item}
			collection={Patients}
			subscription="patients-of-doctor"
			selector={{doctor: item.name}}
			root="/doctor"
			subheader={patients => `soigne ${patients.length} patients`}
			content={patients => (
				<div>
					{patients.slice(0,NITEMS).map(patient => <PatientChip key={patient._id} patient={patient}/>)}
					{patients.length > NITEMS && `et ${patients.length - NITEMS} autres`}
				</div>
			)}
			avatar={<Avatar className={classes.avatar}>Dr</Avatar>}
			DeletionDialog={DoctorDeletionDialog}
			RenamingDialog={DoctorRenamingDialog}
		/>
	) ;

}

DoctorCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,

	item: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true})(DoctorCard) ;
