import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';

import TagCard from '../tags/TagCard';

import StaticPatientChip from '../patients/StaticPatientChip';

import {Patients} from '../../api/patients';
import {insurances} from '../../api/insurances';
import {myEncodeURIComponent} from '../../client/uri';
import InsuranceDeletionDialog from './InsuranceDeletionDialog';
import InsuranceRenamingDialog from './InsuranceRenamingDialog';

const styles = (theme) =>
	createStyles({
		avatar: {
			color: '#fff',
			backgroundColor: red[500],
		},
		patientChip: {
			marginRight: theme.spacing(1),
			backgroundColor: '#aaa',
			fontWeight: 'normal',
			color: '#fff',
		},
	});

const useStyles = makeStyles(styles);

const StaticInsuranceCard = ({item, loading = false}) => {
	const classes = useStyles();

	if (loading) return null;
	if (item === undefined) return null;

	return (
		<TagCard
			tag={item}
			collection={Patients}
			statsCollection={insurances.cache.Stats}
			subscription={insurances.options.parentPublication}
			statsSubscription={insurances.options.parentPublicationStats}
			selector={{insurances: item.name}}
			options={{fields: StaticPatientChip.projection}}
			limit={1}
			url={(name) => `/insurance/${myEncodeURIComponent(name)}`}
			subheader={({count}) =>
				count === undefined ? '...' : `assure ${count} patients`
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
			avatar={<Avatar className={classes.avatar}>In</Avatar>}
			DeletionDialog={InsuranceDeletionDialog}
			RenamingDialog={InsuranceRenamingDialog}
		/>
	);
};

StaticInsuranceCard.propTypes = {
	item: PropTypes.object,
	loading: PropTypes.bool,
};

export default StaticInsuranceCard;
