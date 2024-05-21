import {assert} from 'chai';
import request from 'supertest';

import {map} from '@iterable-iterator/map';
import {nrepeat} from '@iterable-iterator/repeat';
import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';
import {chain} from '@iterable-iterator/chain';

import {server, setLike} from '../../imports/_test/fixtures';
import sleep from '../../imports/lib/async/sleep';

import {RateLimiterMemory, pipe} from './rateLimit';
import {createRouter} from './route';

const _repeat = <T>(n: number, fn: () => T): T[] =>
	list(map(fn, nrepeat(undefined, n)));

server(__filename, () => {
	it('should not rate-limit bursts below quota', async () => {
		const routes = createRouter();
		routes.enable('trust proxy');

		const points = 10;
		const duration = 60;

		const rateLimiter = new RateLimiterMemory({
			// NOTE key prefix is not necessary since each RateLimiterMemory is backed
			// by its own storage.
			keyPrefix: '',
			points,
			duration,
		});

		routes.use(pipe(rateLimiter));

		routes.get(`/test`, async (_req, res, _next) => {
			res.send('OK');
		});

		const send = () =>
			request(routes)
				.get('/test')
				.set('X-Forwarded-For', '127.0.0.1')
				.set('Accept', 'text/html')
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200);

		const start = new Date();

		const responses = await Promise.all(_repeat(points, send));

		const stop = new Date();

		const elapsed = stop.getTime() - start.getTime();

		assert.isAtMost(elapsed, duration * 1000);

		const bodies = setLike(map((res) => res.text, responses));

		assert.deepEqual(bodies, setLike(_repeat(points, () => 'OK')));
	});

	it('should not rate-limit unrelated requests', async () => {
		const routes = createRouter();
		routes.enable('trust proxy');

		const n = 10;
		const duration = 60;

		const rateLimiter = new RateLimiterMemory({
			// NOTE key prefix is not necessary since each RateLimiterMemory is backed
			// by its own storage.
			keyPrefix: '',
			points: 1,
			duration,
		});

		routes.use(pipe(rateLimiter));

		routes.get(`/test`, async (_req, res, _next) => {
			res.send('OK');
		});

		let i = 0;

		const send = () =>
			request(routes)
				.get('/test')
				.set('X-Forwarded-For', `192.168.0.${++i}`)
				.set('Accept', 'text/html')
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200);

		const start = new Date();

		const responses = await Promise.all(_repeat(n, send));

		const stop = new Date();

		const elapsed = stop.getTime() - start.getTime();

		assert.isAtMost(elapsed, duration * 1000);

		const bodies = setLike(map((res) => res.text, responses));

		assert.deepEqual(bodies, setLike(_repeat(n, () => 'OK')));
	});

	it('should rate-limit bursts above quota', async () => {
		const routes = createRouter();
		routes.enable('trust proxy');

		const points = 2;
		const duration = 60;

		const rateLimiter = new RateLimiterMemory({
			// NOTE key prefix is not necessary since each RateLimiterMemory is backed
			// by its own storage.
			keyPrefix: '',
			points,
			duration,
		});

		routes.use(pipe(rateLimiter));

		routes.get(`/test`, async (_req, res, _next) => {
			res.send('OK');
		});

		const send = () =>
			request(routes)
				.get('/test')
				.set('X-Forwarded-For', '127.0.0.1')
				.set('Accept', 'text/html')
				.expect('Content-Type', 'text/html; charset=utf-8');

		const start = new Date();

		const responses = await Promise.all(_repeat(points + 1, send));

		const stop = new Date();

		const elapsed = stop.getTime() - start.getTime();

		assert.isAtMost(elapsed, duration * 1000);

		assert.deepEqual(
			setLike(map((res) => res.status, responses)),
			setLike(
				chain(
					_repeat(points, () => 200),
					[429],
				),
			),
		);

		assert.deepEqual(
			setLike(map((res) => res.text, responses)),
			setLike(
				chain(
					_repeat(points, () => 'OK'),
					['Too Many Requests'],
				),
			),
		);

		assert.deepEqual(
			setLike(map((res) => res.headers['x-ratelimit-limit'], responses)),
			setLike(_repeat(points + 1, () => `${points}`)),
		);
	});

	it('should not rate-limit after elapsed duration', async () => {
		const routes = createRouter();
		routes.enable('trust proxy');

		const duration = 1;

		const rateLimiter = new RateLimiterMemory({
			// NOTE key prefix is not necessary since each RateLimiterMemory is backed
			// by its own storage.
			keyPrefix: '',
			points: 1,
			duration,
		});

		routes.use(pipe(rateLimiter));

		routes.get(`/test`, async (_req, res, _next) => {
			res.send('OK');
		});

		const send = () =>
			request(routes)
				.get('/test')
				.set('X-Forwarded-For', '127.0.0.1')
				.set('Accept', 'text/html')
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(200);

		for (const i of range(2)) {
			const isFirst = i === 0;
			if (!isFirst) {
				// eslint-disable-next-line no-await-in-loop
				await sleep(duration * 1000);
			}

			// eslint-disable-next-line no-await-in-loop
			const response = await send();
			assert.equal(response.text, 'OK');
		}
	});

	it('should rate-limit before duration elapsed', async () => {
		const routes = createRouter();
		routes.enable('trust proxy');

		const duration = 1;

		const rateLimiter = new RateLimiterMemory({
			// NOTE key prefix is not necessary since each RateLimiterMemory is backed
			// by its own storage.
			keyPrefix: '',
			points: 1,
			duration,
		});

		routes.use(pipe(rateLimiter));

		routes.get(`/test`, async (_req, res, _next) => {
			res.send('OK');
		});

		const send = () =>
			request(routes)
				.get('/test')
				.set('X-Forwarded-For', '127.0.0.1')
				.set('Accept', 'text/html')
				.expect('Content-Type', 'text/html; charset=utf-8');

		for (const i of range(2)) {
			const start = new Date();
			const isFirst = i === 0;
			if (!isFirst) {
				// eslint-disable-next-line no-await-in-loop
				await sleep((duration / 2) * 1000);
			}

			// eslint-disable-next-line no-await-in-loop
			const response = await send();
			const stop = new Date();

			const elapsed = stop.getTime() - start.getTime();

			assert.isAtMost(elapsed, duration * 1000);

			if (isFirst) {
				assert.equal(response.status, 200);
				assert.equal(response.text, 'OK');
			} else {
				assert.equal(response.status, 429);
				assert.equal(response.text, 'Too Many Requests');
			}
		}
	});
});
