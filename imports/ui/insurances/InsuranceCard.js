import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';

import TagCard from '../tags/TagCard.js';
import withItem from '../tags/withItem.js';

import PatientChip from '../patients/PatientChip.js';
import InsuranceDeletionDialog from './InsuranceDeletionDialog.js';
import InsuranceRenamingDialog from './InsuranceRenamingDialog.js';

import { Patients } from '../../api/patients.js';
import { Insurances, insurances } from '../../api/insurances.js';

import { myEncodeURIComponent } from '../../client/uri.js';

const styles = theme => ({
	avatar: {
		color: '#fff',
		backgroundColor: red[500],
	},
});

const NITEMS = 1;

function InsuranceCard ( { classes , item , name , loading } ) {

	if (loading) return '...Loading';

	if (item === undefined) return `Insurance ${name} does not exist`;

	return (
		<TagCard
			tag={item}
			collection={Patients}
			subscription={insurances.options.parentPublication}
			selector={{insurances: item.name}}
			url={`/insurance/${myEncodeURIComponent(item.name)}`}
			subheader={patients => `assure ${patients.length} patients`}
			content={patients => (
				<div>
					{patients.slice(0,NITEMS).map(patient => <PatientChip key={patient._id} patient={patient}/>)}
					{patients.length > NITEMS && <Chip label={`+ ${patients.length - NITEMS}`}/> }
				</div>
			)}
			avatar={<Avatar className={classes.avatar}>In</Avatar>}
			DeletionDialog={InsuranceDeletionDialog}
			RenamingDialog={InsuranceRenamingDialog}
		/>
	) ;

}

InsuranceCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,

	item: PropTypes.object,
};

const InsuranceCardWithoutItem = withStyles(styles, { withTheme: true})(InsuranceCard) ;

export default InsuranceCardWithoutItem ;

const InsuranceCardWithItem = withItem(Insurances, insurances.options.singlePublication)(InsuranceCardWithoutItem);

export {
	InsuranceCardWithoutItem,
	InsuranceCardWithItem,
} ;
