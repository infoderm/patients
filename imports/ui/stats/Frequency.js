import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;
import { Patients } from '../../api/patients.js';
import { Consultations } from '../../api/consultations.js';

import React from 'react';

import startOfToday from 'date-fns/start_of_today';
import subYears from 'date-fns/sub_years';
import isAfter from 'date-fns/is_after';

import { at_least , count } from '@aureooms/js-cardinality';
import { sum , map , sorted } from '@aureooms/js-itertools';
import { fromkeys , object } from '@aureooms/js-mapping';
import { increasing } from '@aureooms/js-compare';

import StackedBarChart from './StackedBarChart.js';

const Chart = ({
	width,
	height,
	patients,
	consultations,
}) => {

	const id2count = new Map(fromkeys(map(patient => patient._id, patients), 0));

	for (const consultation of consultations) {
		const id = consultation.patientId;
		id2count.set(id,id2count.get(id)+1);
	}

	const id2sex = new Map(map(patient => [patient._id, patient.sex], patients));

	const count2count = new Map();

	for (const [id, count] of id2count.entries()) {
		if ( !count2count.has(count)) count2count.set(count,new Map(fromkeys(['male', 'female', 'other', 'none'], 0)));
		const sex2count = count2count.get(count);
		const sex = id2sex.get(id) || 'none';
		sex2count.set(sex,sex2count.get(sex)+1);
	}

	const data = [];

	for (const key of sorted(increasing, count2count.keys())) {
		const d = { key : `${key} consultations` } ;
		const sex2count = count2count.get(key);
		for ( const [ sex , count ] of sex2count.entries() ) {
			d[sex] = count;
		}
		data.push(d);
	}

	return <StackedBarChart width={width} height={height} data={data}/> ;

} ;

export default withTracker(() => {
	Meteor.subscribe('patients');
	Meteor.subscribe('consultations');
	return {
		patients: Patients.find({}, { sort: { lastname: 1 } }).fetch() ,
		consultations: Consultations.find({}, {sort: {datetime: -1}}).fetch() ,
	} ;
}) (Chart) ;
