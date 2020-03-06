import React from 'react' ;
import { makeStyles } from '@material-ui/core/styles';

import ConsultationCard from './ConsultationCard.js';

const useStyles = makeStyles(
	theme => ({
		container: {
			padding: theme.spacing(3),
		},
	})
);

export default function ConsultationsList ( { items , itemProps } ) {

	const classes = useStyles();

	return (
		<div className={classes.container}>
			{
				items.map(
					consultation => (
						<ConsultationCard
							key={consultation._id}
							consultation={consultation}
							{...itemProps}
						/>
					)
				)
			}
		</div>
	) ;

}
