import {xml2json} from 'xml-js';

import schema from '../lib/schema';

import {type EidFields} from './collection/eids';

const text = schema.object({
	_text: schema.string().optional(),
});

export const eidXml = schema.object({
	_declaration: schema.object({
		_attributes: schema
			.object({
				encoding: schema.string(),
				version: schema.string(),
			})
			.partial(),
	}),
	eid: schema.object({
		_attributes: schema
			.object({
				graphpersoversion: schema.string(),
				version: schema.string(),
			})
			.partial(),
		address: schema
			.object({
				municipality: text.optional(),
				streetandnumber: text.optional(),
				zip: text.optional(),
			})
			.optional(),
		card: schema
			.object({
				_attributes: schema
					.object({
						carddata_appl_version: schema.string(),
						cardnumber: schema.string(),
						chipnumber: schema.string(),
						documenttype: schema.string(),
						validitydatebegin: schema.string(),
						validitydateend: schema.string(),
					})
					.partial(),
				deliverymunicipality: text.optional(),
			})
			.optional(),
		certificates: schema
			.object({
				authentication: text.optional(),
				citizenca: text.optional(),
				root: text.optional(),
				rrn: text.optional(),
				signing: text.optional(),
			})
			.optional(),
		identity: schema
			.object({
				_attributes: schema
					.object({
						dateofbirth: schema.string(),
						gender: schema.string(),
						nationalnumber: schema.string(),
						specialstatus: schema.string(),
					})
					.partial(),
				firstname: text.optional(),
				middlenames: text.optional(),
				name: text.optional(),
				nationality: text.optional(),
				photo: text.optional(),
				placeofbirth: text.optional(),
			})
			.optional(),
	}),
});

const eidParseXML = (xmlString: string): EidFields => {
	// TODO validate using xsd
	const jsonString = xml2json(xmlString, {compact: true, spaces: 4});
	const json = JSON.parse(jsonString);
	console.debug('eidXMLToJSON', {json});

	const {
		_declaration: {_attributes: xml},
		eid: {_attributes: eid, address, card, certificates, identity},
	} = eidXml.parse(json);

	return {
		xml,
		eid,
		address: {
			municipality: address?.municipality?._text,
			streetandnumber: address?.streetandnumber?._text,
			zip: address?.zip?._text,
		},
		card: {
			...card?._attributes,
			deliverymunicipality: card?.deliverymunicipality?._text,
		},
		certificates: {
			authentication: certificates?.authentication?._text,
			citizenca: certificates?.citizenca?._text,
			root: certificates?.root?._text,
			rrn: certificates?.rrn?._text,
			signing: certificates?.signing?._text,
		},
		identity: {
			...identity?._attributes,
			nationality: identity?.nationality?._text,
			firstname: identity?.firstname?._text,
			middlenames: identity?.middlenames?._text,
			name: identity?.name?._text,
			photo: identity?.photo?._text,
			placeofbirth: identity?.placeofbirth?._text,
		},
	};
};

export default eidParseXML;
