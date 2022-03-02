const $false = {$expr: {$eq: [0, 1]}}; // NOTE Logical false

const overlapsInterval = (
	begin: number,
	end: number,
	measure = 0,
	beginKey = 'begin',
	endKey = 'end',
	measureKey = 'measure',
) =>
	end - begin < measure
		? $false
		: {
				// TODO optimize with $lt/$gt to avoid items that pass multiple tests.
				$or: [
					// beginKey <= begin <= begin + measure <= endKey/end
					{
						[beginKey]: {
							$lte: begin,
						},
						[endKey]: {
							$gte: begin + measure, // <= end
						},
					},
					// beginKey/begin <= end - measure <= end <= endKey
					{
						[beginKey]: {
							$lte: end - measure, // >= begin
						},
						[endKey]: {
							$gte: end,
						},
					},
					// begin <= beginKey <= begin + measure <= endKey <= end
					{
						[beginKey]: {
							$gte: begin,
						},
						[endKey]: {
							$lte: end,
						},
						[measureKey]: {
							// TODO looks like this one is implied
							$gte: measure,
						},
					},
				],
		  };

export default overlapsInterval;
