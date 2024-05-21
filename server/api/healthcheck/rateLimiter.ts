import {RateLimiterMemory} from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
	// NOTE key prefix is not necessary since each RateLimiterMemory is backed
	// by its own storage.
	keyPrefix: '',
	points: 15, // NOTE 15 points
	duration: 60, // NOTE Per minute
});

export default rateLimiter;
