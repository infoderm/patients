const beginsInInterval = (
	begin: number | Date,
	end: number | Date,
	beginKey = 'begin'
) => ({
	[beginKey]: {
		$gte: begin,
		$lt: end
	}
});

export default beginsInInterval;
