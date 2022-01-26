// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {assert} from 'chai';

import startOfYear from 'date-fns/startOfYear';
import addYears from 'date-fns/addYears';

import {randomUserId, server, throws} from '../../../test/fixtures';
import {newPatient} from '../../_dev/populate/patients';
import {newConsultation} from '../../_dev/populate/consultations';

import invoke from '../invoke';
import csv from './csv';

const prepare = async (userId) => {
	const patientAId = await newPatient({userId});
	const patientBId = await newPatient({userId});
	const patientXId = await newPatient({userId: `${userId}x`});

	const datetime = new Date();

	const firstBook = 1;
	const lastBook = 5;
	const maxRows = 4;

	await newConsultation(
		{userId},
		{
			patientId: patientAId,
			datetime,
			book: 'abracadabra',
		},
	);

	await newConsultation(
		{userId},
		{
			patientId: patientAId,
			datetime,
			book: `${firstBook}`,
			price: 123,
		},
	);

	await newConsultation(
		{userId},
		{
			patientId: patientAId,
			datetime,
			book: `${lastBook}`,
			price: 456,
		},
	);

	await newConsultation(
		{userId},
		{
			patientId: patientAId,
			datetime,
			book: `${firstBook - 1}`,
		},
	);

	await newConsultation(
		{userId},
		{
			patientId: patientAId,
			datetime,
			book: `${lastBook + 1}`,
		},
	);

	await newConsultation(
		{userId},
		{
			patientId: patientBId,
			datetime,
			book: `${firstBook}`,
			price: 7,
		},
	);

	await newConsultation(
		{userId: `${userId}x`},
		{
			patientId: patientXId,
			datetime,
			book: `${firstBook}`,
		},
	);

	await newConsultation(
		{userId: `${userId}x`},
		{
			patientId: patientXId,
			datetime,
			book: `${lastBook}`,
		},
	);

	const begin = startOfYear(datetime);
	const end = addYears(begin, 1);

	const expected = `2022/1,2022/2,2022/3,2022/4,2022/5
123,,,,456
7,,,,
,,,,
,,,,`;

	return {
		expected,
		begin,
		end,
		firstBook,
		lastBook,
		maxRows,
	};
};

server(__filename, () => {
	it('can downlowd books csv file', async () => {
		const userId = randomUserId();

		const {expected, begin, end, firstBook, lastBook, maxRows} = await prepare(
			userId,
		);

		const result = await invoke(csv, {userId}, [
			begin,
			end,
			firstBook,
			lastBook,
			maxRows,
		]);

		assert.equal(result, expected);
	});

	it('cannot download csv file if not logged in', async () => {
		const userId = randomUserId();

		const {begin, end, firstBook, lastBook, maxRows} = await prepare(userId);

		return throws(
			async () => invoke(csv, {}, [begin, end, firstBook, lastBook, maxRows]),
			/not-authorized/,
		);
	});
});
