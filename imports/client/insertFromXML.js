import { Meteor } from 'meteor/meteor' ;
import { xml2json } from 'xml-js' ;

export default function insertFromXML ( xmlString ) {

  // TODO validate using xsd
  const jsonString = xml2json(xmlString, {compact: true, spaces: 4});
  const json = JSON.parse(jsonString);
  console.log(json);

  const identity = json.eid.identity ;
  const attributes = identity._attributes ;
  const d = attributes.dateofbirth;

  Meteor.call('patients.insert', {
    niss: attributes.nationalnumber,
    firstname: identity.firstname._text,
    lastname: identity.name._text,
    photo: identity.photo._text,
    birthdate: `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,
    sex: attributes.gender,
  });

}
