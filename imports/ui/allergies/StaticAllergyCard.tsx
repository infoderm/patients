import React from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';

import debounce from 'debounce';
import TagCard from '../tags/TagCard';

import StaticPatientChip from '../patients/StaticPatientChip';

import call from '../../api/call';
import {Patients} from '../../api/patients';
import {allergies, AllergyDocument} from '../../api/allergies';

import ColorPicker from '../input/ColorPicker';

import {myEncodeURIComponent} from '../../client/uri';
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

interface StaticAllergyCardProps {
	loading: boolean;
	item: AllergyDocument;
}

const StaticAllergyCard = React.forwardRef<any, StaticAllergyCardProps>(
	({loading, item}, ref) => {
		const classes = useStyles();

		if (loading) return null;
		if (item === undefined) return null;

		const onChange = async (color: string) => {
			if (color !== item.color) {
				try {
					await call('allergies.changeColor', item._id, color);
					console.log(`Changed color of allergy ${item._id} to ${color}`);
				} catch (error: unknown) {
					console.error(error);
				}
			}
		};

		return (
			<TagCard
				ref={ref}
				tag={item}
				collection={Patients}
				statsCollection={allergies.cache.Stats}
				subscription={allergies.options.parentPublication}
				statsSubscription={allergies.options.parentPublicationStats}
				selector={{allergies: item.name}}
				options={{fields: StaticPatientChip.projection}}
				limit={1}
				url={(name: string) => `/allergy/${myEncodeURIComponent(name)}`}
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
	}
);

export default StaticAllergyCard;
