import {RateLimiterMemory} from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
	// NOTE key prefix is not necessary since each RateLimiterMemory is backed
	// by its own storage.
	keyPrefix: '',
	points: 6, // NOTE 6 points
	duration: 60, // NOTE Per minute
});

export default rateLimiter;
