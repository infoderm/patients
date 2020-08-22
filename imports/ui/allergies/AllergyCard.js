import {Meteor} from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';

import TagCard from '../tags/TagCard.js';

import PatientChip from '../patients/PatientChip.js';

import AllergyDeletionDialog from './AllergyDeletionDialog.js';
import AllergyRenamingDialog from './AllergyRenamingDialog.js';
import withAllergy from './withAllergy.js';

import {Patients} from '../../api/patients.js';
import {allergies} from '../../api/allergies.js';

import ColorPicker from '../input/ColorPicker';
import debounce from 'debounce';

import {myEncodeURIComponent} from '../../client/uri.js';

const useStyles = makeStyles((theme) => ({
	avatar: {
		color: '#fff',
		backgroundColor: green[500]
	},
	chip: {
		marginRight: theme.spacing(1)
	}
}));

const AllergyCard = ({item, loading}) => {
	const classes = useStyles();

	if (loading) return null;
	if (item === undefined) return null;

	const onChange = (color) => {
		if (color !== item.color) {
			Meteor.call('allergies.changeColor', item._id, color, (err, _id) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`Changed color of allergy ${item._id} to ${color}`);
				}
			});
		}
	};

	return (
		<TagCard
			tag={item}
			collection={Patients}
			countCollection={allergies.cache.Counts}
			subscription={allergies.options.parentPublication}
			countSubscription={allergies.options.parentPublicationCount}
			selector={{allergies: item.name}}
			options={{fields: PatientChip.projection}}
			limit={1}
			url={(name) => `/allergy/${myEncodeURIComponent(name)}`}
			subheader={(count) =>
				count === undefined ? '...' : `affecte ${count} patients`
			}
			content={(count, patients) =>
				patients === undefined ? (
					'...'
				) : (
					<div>
						{patients.map((patient) => (
							<PatientChip key={patient._id} patient={patient} />
						))}
						{count !== undefined && count > patients.length && (
							<Chip
								className={classes.chip}
								label={`+ ${count - patients.length}`}
							/>
						)}
					</div>
				)
			}
			actions={() => (
				<ColorPicker
					name="color"
					defaultValue={item.color || '#e0e0e0'}
					onChange={debounce(onChange, 1000)}
				/>
			)}
			avatar={<Avatar className={classes.avatar}>Al</Avatar>}
			DeletionDialog={AllergyDeletionDialog}
			RenamingDialog={AllergyRenamingDialog}
		/>
	);
};

AllergyCard.propTypes = {
	item: PropTypes.object
};

const AllergyCardWithoutItem = AllergyCard;

export default AllergyCardWithoutItem;

const AllergyCardWithItem = withAllergy(AllergyCardWithoutItem);

export {AllergyCardWithoutItem, AllergyCardWithItem};
