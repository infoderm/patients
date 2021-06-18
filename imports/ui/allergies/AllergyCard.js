import {Meteor} from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';

import debounce from 'debounce';
import TagCard from '../tags/TagCard';

import StaticPatientChip from '../patients/StaticPatientChip';

import {Patients} from '../../api/patients';
import {allergies} from '../../api/allergies';

import ColorPicker from '../input/ColorPicker';

import {myEncodeURIComponent} from '../../client/uri';
import withAllergy from './withAllergy';
import AllergyRenamingDialog from './AllergyRenamingDialog';
import AllergyDeletionDialog from './AllergyDeletionDialog';

const useStyles = makeStyles((theme) => ({
	avatar: {
		color: '#fff',
		backgroundColor: green[500]
	},
	patientChip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#aaa',
		fontWeight: 'normal',
		color: '#fff'
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
			statsCollection={allergies.cache.Stats}
			subscription={allergies.options.parentPublication}
			statsSubscription={allergies.options.parentPublicationStats}
			selector={{allergies: item.name}}
			options={{fields: StaticPatientChip.projection}}
			limit={1}
			url={(name) => `/allergy/${myEncodeURIComponent(name)}`}
			subheader={({count}) =>
				count === undefined ? '...' : `affecte ${count} patients`
			}
			content={({count}, patients) =>
				patients === undefined ? (
					'...'
				) : (
					<div>
						{patients.map((patient) => (
							<StaticPatientChip
								key={patient._id}
								patient={patient}
								className={classes.patientChip}
							/>
						))}
						{count !== undefined && count > patients.length && (
							<Chip label={`+ ${count - patients.length}`} />
						)}
					</div>
				)
			}
			actions={() => (
				<ColorPicker
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
