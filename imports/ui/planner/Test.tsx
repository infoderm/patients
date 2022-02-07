import React, {useState, useEffect} from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';

import DateTimePicker from '@mui/lab/DateTimePicker';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import {map} from '@iterable-iterator/map';
import {sorted} from '@iterable-iterator/sorted';

import TextField from '../input/TextField';
import {useDateTimeMask} from '../../i18n/datetime';
import {msToString, units} from '../../api/duration';
import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import call from '../../api/endpoint/call';
import next from '../../api/endpoint/availability/next';
import useSortedWorkSchedule from '../settings/useSortedWorkSchedule';
import nonOverlappingIntersection from '../../lib/interval/nonOverlappingIntersection';
import {weekSlotsCyclicOrder} from '../settings/useWorkScheduleSort';
import {useSetting} from '../settings/hooks';

const useStyles = makeStyles((theme) => ({
	explanation: {
		textAlign: 'center',
		fontSize: '1.3em',
		fontWeight: 'bold',
	},
	details: {
		padding: '1em',
	},
	summary: {
		fontSize: '2em',
		cursor: 'pointer',
		color: '#d44',
	},
	pre: {
		whiteSpace: 'pre-wrap',
		backgroundColor: '#333',
		color: '#ccc',
		padding: '1.5em',
		borderRadius: '.5em',
		textTransform: 'initial',
	},
	buttons: {
		textAlign: 'center',
		paddingBottom: '2em',
	},
	button: {
		margin: '1em',
	},
	formControl: {
		margin: theme.spacing(3),
	},
}));

const slotOrder = weekSlotsCyclicOrder(0);

export default function Test() {
	const classes = useStyles();

	const localizedDateTimeMask = useDateTimeMask();

	const {loading: loadingAppointmentDuration, value: appointmentDuration} =
		useSetting('appointment-duration');

	const [respectSchedule, setRespectSchedule] = useState(true);
	const [begin, setBegin] = useState(new Date());
	const [duration, setDuration] = useStateWithInitOverride(
		appointmentDuration.length > 0 ? appointmentDuration[0] : 0,
		[appointmentDuration],
	) as [number, (number) => void];

	// NOTE Adding + duration to the default whole span makes it intersect all
	// slots with measure >= duration, including those that span two calendar
	// weeks. Another approach would be to handle the case where no constraints
	// are given to next.
	const week: Array<[number, number]> = [[0, units.week + duration]];

	const [results, setResults] = useState([]);

	const workSchedule = useSortedWorkSchedule();

	let constraints = week; // TODO add patient's constraints

	if (respectSchedule) {
		constraints = Array.from(
			nonOverlappingIntersection(
				constraints,
				map(
					({beginModuloWeek, endModuloWeek}) => [
						beginModuloWeek,
						endModuloWeek,
					],
					sorted(slotOrder, workSchedule),
				),
			),
		);
	}

	useEffect(() => {
		let isCancelled = false;

		call(next, begin, duration, constraints).then(
			(result) => {
				if (isCancelled) return;
				setResults([result]);
			},
			(error) => {
				if (isCancelled) return;
				console.debug(error);
				setResults([{error}]);
			},
		);

		return () => {
			isCancelled = true;
		};
	}, [Number(begin), duration, JSON.stringify(constraints)]);

	return (
		<div>
			<p className={classes.explanation}>Query:</p>
			<div className={classes.buttons}>
				<FormControl component="fieldset" className={classes.formControl}>
					<FormLabel component="legend">Constraints</FormLabel>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									checked={respectSchedule}
									onChange={() => {
										setRespectSchedule(!respectSchedule);
									}}
								/>
							}
							label="Respect doctor's schedule"
						/>
					</FormGroup>
					<FormHelperText>TODO allow patient&apos;s constraints</FormHelperText>
				</FormControl>
				<DateTimePicker
					mask={localizedDateTimeMask}
					value={begin}
					label="Begin"
					renderInput={(props) => (
						<TextField {...props} InputLabelProps={{shrink: true}} />
					)}
					onChange={(value) => {
						if (value instanceof Date) setBegin(value);
					}}
				/>
				<FormControl>
					<InputLabel htmlFor="duration">Duration</InputLabel>
					<Select
						readOnly={loadingAppointmentDuration}
						value={duration}
						inputProps={{
							name: 'duration',
							id: 'duration',
						}}
						onChange={(e) => {
							setDuration(e.target.value);
						}}
					>
						{appointmentDuration.map((x) => (
							<MenuItem key={x} value={x}>
								{msToString(x)}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div className={classes.details}>
				<p className={classes.explanation}>Doctor&apos;s constraints:</p>
				<pre className={classes.pre}>
					{JSON.stringify(workSchedule)}
					<br />
				</pre>
			</div>
			<div className={classes.details}>
				<p className={classes.explanation}>Constraints:</p>
				<pre className={classes.pre}>
					{JSON.stringify(constraints)}
					<br />
				</pre>
			</div>
			<div className={classes.details}>
				<p className={classes.explanation}>Results:</p>
				<pre className={classes.pre}>
					{JSON.stringify(results, null, 2)}
					<br />
				</pre>
			</div>
		</div>
	);
}
