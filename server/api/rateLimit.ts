import addMilliseconds from 'date-fns/addMilliseconds';
import {type NextFunction, type Request, type Response} from 'express';
import {
	type RateLimiterAbstract as RateLimiter,
	type RateLimiterRes,
} from 'rate-limiter-flexible';

const headersFromRateLimiterRes = (
	rateLimiter: RateLimiter,
	rateLimiterRes: RateLimiterRes,
) => ({
	'Retry-After': rateLimiterRes.msBeforeNext / 1000,
	'X-RateLimit-Limit': rateLimiter.points,
	'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
	'X-RateLimit-Reset': addMilliseconds(new Date(), rateLimiterRes.msBeforeNext),
});

export const pipe =
	(rateLimiter: RateLimiter) =>
	async (req: Request, res: Response, next: NextFunction) =>
		rateLimiter.consume(req.ip ?? '', 1).then(
			(rateLimiterRes: RateLimiterRes) => {
				res.set(headersFromRateLimiterRes(rateLimiter, rateLimiterRes));
				next();
			},
			(error: RateLimiterRes) => {
				res
					.status(429)
					.set(headersFromRateLimiterRes(rateLimiter, error))
					.send('Too Many Requests');
			},
		);

export {RateLimiterMemory} from 'rate-limiter-flexible';
