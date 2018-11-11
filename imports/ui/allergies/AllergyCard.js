import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';

import TagCard from '../tags/TagCard.js';

import PatientChip from '../patients/PatientChip.js';
import AllergyDeletionDialog from './AllergyDeletionDialog.js';
import AllergyRenamingDialog from './AllergyRenamingDialog.js';

import { Patients } from '../../api/patients.js';
import { allergies } from '../../api/allergies.js';

const styles = theme => ({
	avatar: {
		color: '#fff',
		backgroundColor: green[500],
	},
});

const NITEMS = 1;

function AllergyCard ( { classes , item } ) {

	return (
		<TagCard
			tag={item}
			collection={Patients}
			subscription={allergies.options.parentPublication}
			selector={{allergies: item.name}}
			root="/allergy"
			subheader={patients => `affecte ${patients.length} patients`}
			content={patients => (
				<div>
					{patients.slice(0,NITEMS).map(patient => <PatientChip key={patient._id} patient={patient}/>)}
					{patients.length > NITEMS && <Chip label={`+ ${patients.length - NITEMS}`}/> }
				</div>
			)}
			avatar={<Avatar className={classes.avatar}>Al</Avatar>}
			DeletionDialog={AllergyDeletionDialog}
			RenamingDialog={AllergyRenamingDialog}
		/>
	) ;

}

AllergyCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,

	item: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true})(AllergyCard) ;
