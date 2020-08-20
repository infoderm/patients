import React, {useState} from 'react';

import {useHistory} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {format} from 'date-fns';

export default function Calendar() {
	const [day, setDay] = useState(format(new Date(), 'yyyy-MM-dd'));
	const history = useHistory();

	const onDayClick = (event) => {
		const day = event.target.value;
		setDay(day);
		history.push(`calendar/${day}`);
	};

	return (
		<Grid container>
			<Grid item xs={2}>
				<TextField
					type="date"
					s={2}
					label="Day"
					InputLabelProps={{
						shrink: true
					}}
					value={day}
					onChange={onDayClick}
				/>
			</Grid>
		</Grid>
	);
}
