const intersectsInterval = (
	begin: number | Date,
	end: number | Date,
	beginKey = 'begin',
	endKey = 'end'
) => ({
	$or: [
		{
			[beginKey]: {
				$gte: begin,
				$lt: end
			}
		},
		{
			[endKey]: {
				$gt: begin,
				$lte: end
			}
		},
		{
			[beginKey]: {
				$lt: begin
			},
			[endKey]: {
				$gt: end
			}
		}
	]
});

export default intersectsInterval;
