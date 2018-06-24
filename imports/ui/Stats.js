import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;
import { Patients } from '../api/patients.js';

import React from 'react';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientPinkBlue } from '@vx/gradient';

function Label({ x, y, children }) {
  return (
    <text
      fill="white"
      textAnchor="middle"
      x={x}
      y={y}
      dy=".33em"
      fontSize={9}
    >
      {children}
    </text>
  );
}

function Chart ({
  width = 300,
  height = 300,
  events = false,
  allCount,
  maleCount,
  femaleCount,
  otherCount,
}) {
  if (allCount === 0 || width < 10) return null;
	const radius = Math.min(width, height) / 2;
  const sex = [
    { sex: 'male' , freq: maleCount/allCount },
    { sex: 'female', freq: femaleCount/allCount },
  ];
  return (
    <svg width={width} height={height}>
      <Group top={height / 2} left={width / 2}>
        <Pie
          data={sex}
          pieValue={d => d.freq}
          outerRadius={radius}
          fill="black"
          fillOpacity={d => 1 / (d.index + 2) }
          centroid={(centroid, arc) => {
            const [x, y] = centroid;
            return <Label x={x} y={y}>{arc.data.sex}</Label>;
          }}
        />
      </Group>
    </svg>
  );
}

export default withTracker(() => {
	Meteor.subscribe('patients');
	return {
		allCount: Patients.find({}).count() ,
		femaleCount: Patients.find({ sex: 'female'}).count() ,
		maleCount: Patients.find({ sex: 'male'}).count() ,
	};
}) (Chart) ;
