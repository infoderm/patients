import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';

import startOfToday from 'date-fns/startOfToday';
import subYears from 'date-fns/subYears';
import isAfter from 'date-fns/isAfter';

import { at_least , count } from '@aureooms/js-cardinality';

import eidParseBirthdate from '../../client/eidParseBirthdate.js';
import { Patients } from '../../api/patients.js';
import StackedBarChart from './StackedBarChart.js';

const Chart = ({
    width,
    height,
    patients,
  }) => {

  const today = startOfToday();
  const lt = years => patient => isAfter(eidParseBirthdate(patient.birthdate), subYears(today, years));
  const gt = years => patient => !isAfter(eidParseBirthdate(patient.birthdate), subYears(today, years));
  const data = [];
  let current = patients.filter(patient => !!patient.birthdate) ;
  const incrementYears = 10;
  let fr = 0;
  let to = fr + incrementYears;
  while ( true ) {
    current = current.filter(gt(fr));
    if ( !at_least(1, current) ) break;
    const interval = current.filter(lt(to));
    const d = {key: `${fr} à ${to}`};
    for ( const sex of [ 'male', 'female', 'other', 'none'] ) {
      d[sex] = count(interval.filter(x => (x.sex || 'none') === sex));
    }
    data.push(d);
    fr = to;
    to = fr + incrementYears;
  }

  return <StackedBarChart width={width} height={height} data={data}/> ;

} ;

export default withTracker(() => {
	Meteor.subscribe('patients');
	return {
		patients: Patients.find({}, { sort: { lastname: 1 } }).fetch() ,
	};
}) (Chart) ;
