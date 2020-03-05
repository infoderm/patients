import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import startOfToday from 'date-fns/startOfToday' ;
import startOfDay from 'date-fns/startOfDay';

import { Consultations } from '../../api/consultations.js' ;

import ConsultationsList from './ConsultationsList.js' ;

function LastConsultationsList ( { lastConsultation } ) {

    const lastConsultationDate = lastConsultation && lastConsultation.datetime ? startOfDay(lastConsultation.datetime) : startOfToday();

    return (
        <ConsultationsList day={lastConsultationDate}/>
    ) ;

}

let Component = LastConsultationsList;

Component = withTracker(() => {
    const handle = Meteor.subscribe('consultations.last');

    if ( !handle.ready() ) return {};

    const lastConsultation = Consultations.findOne(
        {
            isDone: true ,
        },
        {
            sort: {
                datetime: -1 ,
                limit: 1 ,
            }
        } ,
    ) ;

    return {
        lastConsultation,
    } ;
}) ( Component ) ;

export default Component;
