import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { HLTReports } from '../../api/hlt-reports.js' ;

import HLTReportCard from './HLTReportCard.js';


function HLTReportDetails ({loading, report}) {

	if (loading) return <div>Loading...</div>;
	if (!report) return <div>Error: HLT report not found.</div>;

	return (
		<div>
			<HLTReportCard report={report} defaultExpanded={true}/>
		</div>
	);
}

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('hlt-report', _id);
	if ( handle.ready() ) {
		const report = HLTReports.findOne(_id);
		return { loading: false, report } ;
	}
	else return { loading: true } ;
}) (HLTReportDetails);
