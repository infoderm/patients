import {xml2json} from 'xml-js';
import {type PatientIdFields} from './collection/patients';

const eidParseXML = (xmlString: string): PatientIdFields => {
	// TODO validate using xsd
	const jsonString = xml2json(xmlString, {compact: true, spaces: 4});
	const json = JSON.parse(jsonString);
	console.debug('eidXMLToJSON', {json});

	const {address, identity} = json.eid;
	const attributes = identity._attributes;
	const d = attributes.dateofbirth;

	return {
		niss: attributes.nationalnumber,
		firstname: identity.firstname._text,
		lastname: identity.name._text,
		photo: identity.photo._text,
		birthdate: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
		sex: attributes.gender,

		municipality: address.municipality._text,
		streetandnumber: address.streetandnumber._text,
		zip: address.zip._text,
	};
};

export default eidParseXML;
