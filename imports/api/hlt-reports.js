import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import dateparse from 'date-fns/parse' ;

import { list } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { enumerate } from '@aureooms/js-itertools' ;

import { Patients } from './patients.js';

export const HLTReports = new Mongo.Collection('hlt-reports');

if (Meteor.isServer) {

	Meteor.publish('hlt-reports', function () {
		return HLTReports.find({ owner: this.userId });
	});

	Meteor.publish('hlt-report', function (_id) {
		check(_id, String);
		return HLTReports.find({ owner: this.userId , _id });
	});

	Meteor.publish('patient.hlt-reports', function (patientId) {
		check(patientId, String);
		return HLTReports.find({ owner: this.userId , patientId: patientId });
	});

}

function sanitize ( {
	patientId,
	raw,
} ) {

	patientId === undefined || check(patientId, String);
	check(raw, String);

	try {
	  const [ json , text ] = parse(raw);
	  const entries = [];
	  for ( const key in json ) {
	    const entry = {
	      patientId,
	      raw: text[key].join('\n'),
	      parsed: true,
	      ...json[key],
	    } ;
	    entries.push(entry);
	  }
	  return entries;
	}
	catch (e) {
	  console.error('Failed to parse report.', e);
	  return [ {
	    patientId,
	    raw,
	    parsed: false,
	  } ];
	}
}

Meteor.methods({
	'hlt-reports.insert'(hltreport) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const entries = sanitize(hltreport);

		let firstId = undefined;

		for ( const entry of entries ) {

			const _id = HLTReports.insert({
				...entry,
				createdAt: new Date(),
				owner: this.userId,
			});

			firstId = firstId || _id ;

		}

		return firstId;


	},

	'hlt-reports.link'(hltreportId, patientId) {
		check(hltreportId, String);
		check(patientId, String);
		const hltreport = HLTReports.findOne(hltreportId);
		const patient = Patients.findOne(patientId);
		if (!hltreport || hltreport.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own hltreport');
		}
		if (!patient || patient.userId !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own patient');
		}
		return HLTReports.update(hltreportId, { $set: { patientId } });
	},

	'hlt-reports.unlink'(hltreportId) {
		check(hltreportId, String);
		const hltreport = HLTReports.findOne(hltreportId);
		if (!hltreport || hltreport.owner !== this.userId) {
			throw new Meteor.Error('not-authorized', 'user does not own hltreport');
		}
		return HLTReports.update(hltreportId, { $unset: { patientId: '' } });
	},

	'hlt-reports.remove'(hltreportId){
		check(hltreportId, String);
		const hltreport = HLTReports.findOne(hltreportId);
		if (!hltreport || hltreport.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return HLTReports.remove(hltreportId);
	},

});

function parseSex ( letter ) {
  switch ( letter ) {
    case 'F':
      return 'female';
    case 'M':
      return 'male';
    default:
      return 'other';
  }
}

function parseDate ( string ) {
  const day = string.slice(0,2);
  const month = string.slice(2,4);
  const year = string.slice(4,8);
  return dateparse(`${year}-${month}-${day}`);
}

function parseDateTime ( string1 , string2 ) {
  const day = string1.slice(0,2);
  const month = string1.slice(2,4);
  const year = string1.slice(4,8);
  const hour = string2.slice(0,2);
  const minute = string2.slice(2,4);

  return dateparse(`${year}-${month}-${day}T${hour}:${minute}:00`);
}

function parseItem ( parts ) {
  const [ code , title , index , unit , flag , measure ] = parts ;

  const item = {
  } ;

  if (index) item.index = index;
  if (unit) item.unit = unit;
  if (flag) item.flag = flag;
  if (measure) {
    if (flag === 'C') {
      item.comment = measure.split('\t');
      if (item.comment.length > 1) item.comment.pop();
    }
    else {
      item.measure = measure;
    }
  }

  return [ code , title.trim(), item ] ;
}

function parse ( raw ) {

  const json = {} ;
  const text = {} ;

  const lines = raw.match(/[^\r\n]+/g);

  for ( const [lineno, line] of enumerate(lines) ) {

    const parts = line.split('\\');
    parts.pop();

    const [ kind , reference , ...rest ] = parts;

    if ( json[reference] === undefined ) {
      json[reference] = {
        reference,
        lab: undefined,
        datetime: undefined,
        subject: {},
        results: {},
	anomalies: 0,
      };
      text[reference] = [];
    }

    const report = json[reference];
    const log = text[reference];
    log.push(line);

    const [ letter , digit ] = kind ;
    switch ( letter ) {
      case 'A':
        switch ( digit ) {
          case '1':
            report.lab = rest[0];
            break;
          case '2':
            report.subject.lastname = rest[0];
            report.subject.firstname = rest[1];
            report.subject.sex = parseSex(rest[2]);
            report.subject.birthdate = parseDate(rest[3]);
            break;
          case '3':
            report.subject.streetandnumber = rest[0];
            report.subject.zip = rest[1];
            report.subject.municipality = rest[2];
            break;
          case '4':
            report.code1 = rest[0];
            report.datetime = parseDateTime(rest[1], rest[2]);
            report.code2 = rest[3];
            break;
          default:
            console.debug('parse-hlt-report', 'unknown-line', line);
            break;
        }
        break;
      case 'L':
        const [ code , title , item ] = parseItem(rest) ;
        if (code.startsWith('t_')) break;
        if (code === 'TEXTEF') break;
        if ( report.results[code] === undefined ) {
          report.results[code] = {
	    line: lineno,
            code,
            title,
            lines: [],
          } ;
        }
	item.line = lineno;
        report.anomalies += (item.flag === '*');
        report.results[code].lines.push(item);
        break;
      default:
        console.debug('parse-hlt-report', 'unknown-line', line);
        break;
    }
  }

  for ( const reference in json ) {
    const report = json[reference];
    const results = [];
    for ( const code in report.results ) {
      results.push(report.results[code]);
    }
    results.sort((x,y) => x.line - y.line);
    report.results = results ;
  }

  return [ json , text ] ;

}

export const hltreports = {
	parse,
} ;
