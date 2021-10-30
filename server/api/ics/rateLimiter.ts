import addMilliseconds from 'date-fns/addMilliseconds';
import {RateLimiterMemory} from 'rate-limiter-flexible';

const rateLimiterOptions = {
	keyPrefix: '',
	points: 6, // 6 points
	duration: 60, // Per minute
};

const rateLimiterHandler = new RateLimiterMemory(rateLimiterOptions);

const headersFromRateLimiterRes = (rateLimiterRes) => ({
	'Retry-After': rateLimiterRes.msBeforeNext / 1000,
	'X-RateLimit-Limit': rateLimiterOptions.points,
	'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
	'X-RateLimit-Reset': addMilliseconds(new Date(), rateLimiterRes.msBeforeNext),
});

const rateLimiter = async (req, res, next) =>
	rateLimiterHandler
		.consume(req.ip, 1)
		.then((rateLimiterRes) => {
			res.set(headersFromRateLimiterRes(rateLimiterRes));
			next();
		})
		.catch((error) => {
			res
				.status(429)
				.set(headersFromRateLimiterRes(error))
				.send('Too Many Requests');
		});

export default rateLimiter;
