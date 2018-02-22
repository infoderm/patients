import { Meteor } from 'meteor/meteor' ;
import { xml2json } from 'xml-js' ;

import { Patients } from '../api/patients.js' ;

export default function insertFromXML ( history, xmlString ) {

  // TODO validate using xsd
  const jsonString = xml2json(xmlString, {compact: true, spaces: 4});
  const json = JSON.parse(jsonString);
  console.log(json);

  const identity = json.eid.identity ;
  const attributes = identity._attributes ;
  const d = attributes.dateofbirth;

  const op = {
    niss: attributes.nationalnumber,
    firstname: identity.firstname._text,
    lastname: identity.name._text,
    photo: identity.photo._text,
    birthdate: `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,
    sex: attributes.gender,
  } ;

  Meteor.subscribe('patients', {
    onReady: () => {
      const patient = Patients.findOne({niss: op.niss});
      if ( patient ) {
        Meteor.call('patients.update', patient._id, op , ( err , res ) => {
          if ( err ) console.log(err);
          else {
            history.push({pathname: `/patient/${patient._id}`}) ;
          }
        } ) ;
      }
      else {
        Meteor.call('patients.insert', op , (err, _id) => {
          if ( err ) console.error(err) ;
          else history.push({pathname: `/patient/${_id}`}) ;
        });
      }
    } ,
    onStop: err => console.error(err) ,
  });

}
