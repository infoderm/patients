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

import ColorPicker from '../input/ColorPicker' ;
import debounce from 'debounce' ;

const styles = theme => ({
	avatar: {
		color: '#fff',
		backgroundColor: green[500],
	},
	chip: {
		marginRight: theme.spacing.unit,
	},
});

const NITEMS = 1;

function AllergyCard ( { classes , item } ) {


	const onChange = color => {
		if ( color !== item.color ) {
			Meteor.call('allergies.changeColor', item._id , color , (err, _id) => {
			  if ( err ) console.error(err) ;
			  else console.log(`Changed color of allergy ${item._id} to ${color}`) ;
			});
		}
	} ;

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
					{patients.length > NITEMS && <Chip className={classes.chip} label={`+ ${patients.length - NITEMS}`}/> }
					<ColorPicker
					  name='color'
					  defaultValue={item.color || '#e0e0e0'}
					  onChange={debounce(onChange,1000)}
					/>
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
