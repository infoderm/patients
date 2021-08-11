import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';

import TagCard from '../tags/TagCard';

import StaticPatientChip from '../patients/StaticPatientChip';

import {Patients} from '../../api/patients';
import {doctors} from '../../api/doctors';

import {myEncodeURIComponent} from '../../client/uri';
import DoctorRenamingDialog from './DoctorRenamingDialog';
import DoctorDeletionDialog from './DoctorDeletionDialog';

const styles = (theme) =>
	createStyles({
		avatar: {
			color: '#fff',
			backgroundColor: blue[500],
		},
		patientChip: {
			marginRight: theme.spacing(1),
			backgroundColor: '#aaa',
			fontWeight: 'normal',
			color: '#fff',
		},
	});

const useStyles = makeStyles(styles);

const StaticDoctorCard = ({item, name, loading = false}) => {
	const classes = useStyles();

	if (loading) {
		return <>...Loading</>;
	}

	if (item === undefined) {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <>{`Doctor ${name} does not exist`}</>;
	}

	return (
		<TagCard
			tag={item}
			collection={Patients}
			statsCollection={doctors.cache.Stats}
			subscription={doctors.options.parentPublication}
			statsSubscription={doctors.options.parentPublicationStats}
			selector={{doctors: item.name}}
			options={{fields: StaticPatientChip.projection}}
			limit={1}
			url={(name: string) => `/doctor/${myEncodeURIComponent(name)}`}
			subheader={({count}) =>
				count === undefined ? '...' : `soigne ${count} patients`
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

StaticDoctorCard.propTypes = {
	item: PropTypes.object,
	name: PropTypes.string,
	loading: PropTypes.bool,
};

export default StaticDoctorCard;
