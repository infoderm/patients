import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import {Pie} from '@vx/shape';
import {Group} from '@vx/group';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';

import {Patients} from '../../api/patients.js';

const Label = ({x, y, children}) => {
	return (
		<text fill="white" textAnchor="middle" x={x} y={y} dy=".33em" fontSize={9}>
			{children}
		</text>
	);
};

const Chart = ({
	width,
	height,
	allCount,
	maleCount,
	femaleCount,
	otherCount,
	noneCount
}) => {
	if (width < 10) {
		return 'Cannot display chart on such small dimensions';
	}

	if (allCount === 0) {
		return 'Not enough data to display chart';
	}

	const radius = Math.min(width, height) / 2;
	const sex = [];
	if (maleCount) {
		sex.push({sex: 'male', freq: maleCount / allCount});
	}

	if (femaleCount) {
		sex.push({sex: 'female', freq: femaleCount / allCount});
	}

	if (otherCount) {
		sex.push({sex: 'other', freq: otherCount / allCount});
	}

	if (noneCount) {
		sex.push({sex: 'none', freq: noneCount / allCount});
	}

	const zScale = [blue[500], pink[500], purple[500], grey[500]];

	return (
		<svg width={width} height={height}>
			<Group top={height / 2} left={width / 2}>
				<Pie
					data={sex}
					pieValue={(d) => d.freq}
					outerRadius={radius}
					fill={(d) => zScale[d.index]}
					centroid={(centroid, arc) => {
						const [x, y] = centroid;
						return (
							<Label x={x} y={y}>{`${arc.data.sex} (${(
								arc.data.freq * 100
							).toPrecision(4)}%)`}</Label>
						);
					}}
				/>
			</Group>
		</svg>
	);
};

export default withTracker(() => {
	Meteor.subscribe('patients');
	return {
		allCount: Patients.find({}).count(),
		femaleCount: Patients.find({sex: 'female'}).count(),
		maleCount: Patients.find({sex: 'male'}).count(),
		otherCount: Patients.find({sex: 'other'}).count(),
		noneCount: Patients.find({sex: ''}).count()
	};
})(Chart);
