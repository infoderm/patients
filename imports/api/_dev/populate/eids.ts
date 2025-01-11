import {faker} from '@faker-js/faker';

import format from 'date-fns/format';

import {makeTemplate} from '../../../_test/fixtures';
import {randomPNGBase64} from '../../../_test/png';

const DATE_FORMAT = 'yyyyMMdd';
const AGE_MAX = 130;

export const newEidData = makeTemplate({
	xml: {
		// eslint-disable-next-line unicorn/text-encoding-identifier-case
		encoding: () => 'UTF-8',
		version: () => '1.0',
	},
	eid: {
		graphpersoversion: () => faker.string.numeric(2),
		version: () => faker.string.numeric(2),
	},
	card: {
		carddata_appl_version: () => faker.string.numeric(2),
		cardnumber: () => faker.string.numeric(12),
		chipnumber: () => faker.string.alphanumeric(32),
		documenttype: () => 'belgian_citizen',
		validitydatebegin: () => format(faker.date.past({years: 30}), DATE_FORMAT),
		validitydateend: () => format(faker.date.past({years: 30}), DATE_FORMAT),
		deliverymunicipality: () => faker.location.county(),
	},
	certificates: {
		authentication: () => faker.string.uuid(),
		citizenca: () => faker.string.uuid(),
		root: () => faker.string.uuid(),
		rrn: () => faker.string.uuid(),
		signing: () => faker.string.uuid(),
	},
	identity: {
		nationality: () => faker.location.country(),
		nationalnumber: () => faker.string.uuid(),
		dateofbirth: () => format(faker.date.past({years: AGE_MAX}), DATE_FORMAT),
		placeofbirth: () => faker.location.city(),
		gender: () => faker.helpers.arrayElement(['male', 'female', undefined]),
		specialstatus: () => faker.word.adjective(),
		name: () => faker.person.lastName(),
		firstname: () => faker.person.firstName(),
		middlenames: () => faker.person.middleName(),
		photo: () => undefined,
	},
	address: {
		municipality: () => faker.location.city(),
		streetandnumber: () => faker.location.streetAddress(),
		zip: () => faker.location.zipCode(),
	},
});

export const exampleEidXML = (options?: {
	nationalnumber?: string;
	dateofbirth?: string;
	name?: string;
	firstname?: string;
	middlenames?: string;
	nationality?: string;
	placeofbirth?: string;
	gender?: 'male' | 'female';
	photo?: string;
	streetandnumber?: string;
	zip?: string;
	municipality?: string;
}) => {
	const {
		nationalnumber,
		dateofbirth,
		name,
		firstname,
		middlenames,
		nationality,
		placeofbirth,
		gender,
		photo,
		streetandnumber,
		zip,
		municipality,
	} = {
		nationalnumber: '70010112345',
		dateofbirth: '19700101',
		name: 'Name',
		firstname: 'First Name',
		middlenames: 'M',
		nationality: 'Belge',
		placeofbirth: 'Bruxelles',
		gender: 'female',
		photo: randomPNGBase64(),
		streetandnumber: 'Rue de la montagne 58 ',
		zip: '1000',
		municipality: 'Bruxelles',
		...options,
	};
	// TODO: Generalizes and escape values.
	return `<?xml version="1.0" encoding="UTF-8"?>
<eid version="4.3" graphpersoversion="00">
	<identity
	  nationalnumber="${nationalnumber}"
	  dateofbirth="${dateofbirth}"
	  gender="${gender}"
	  specialstatus="NO_STATUS"
	>
		<name>${name}</name>
		<firstname>${firstname}</firstname>
		<middlenames>${middlenames}</middlenames>
		<nationality>${nationality}</nationality>
		<placeofbirth>${placeofbirth}</placeofbirth>
		<photo>${photo}</photo>
	</identity>
	<card
		documenttype="belgian_citizen"
		carddata_appl_version="17"
		cardnumber="012345678901"
		chipnumber="0123456789ABCDEF0123456789ABCDEF"
		validitydatebegin="20200101"
		validitydateend="20300101"
	>
		<deliverymunicipality>Bruxelles</deliverymunicipality>
	</card>
	<address>
		<streetandnumber>${streetandnumber}</streetandnumber>
		<zip>${zip}</zip>
		<municipality>${municipality}</municipality>
	</address>
	<certificates>
		<root>ROOT</root>
		<citizenca>CITIZENCA</citizenca>
		<authentication>AUTHENTICATION</authentication>
		<signing>SIGNING</signing>
		<rrn>RRN</rrn>
	</certificates>
</eid>`;
};
