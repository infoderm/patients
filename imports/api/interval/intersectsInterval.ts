const intersectsInterval = (
	begin: number | Date,
	end: number | Date,
	beginKey = 'begin',
	endKey = 'end',
) => ({
	$or: [
		{
			// NOTE Begins inside
			[beginKey]: {
				$gte: begin,
				$lt: end,
			},
		},
		{
			// NOTE Ends inside
			[endKey]: {
				$gt: begin,
				$lte: end,
			},
		},
		{
			// NOTE Begins before and ends after
			[beginKey]: {
				$lt: begin,
			},
			[endKey]: {
				$gt: end,
			},
		},
	],
});

export default intersectsInterval;
