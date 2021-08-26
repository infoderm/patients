import intersectsInterval from './intersectsInterval';

const intersectsOrTouchesInterval = (
	begin: number | Date,
	end: number | Date,
	beginKey = 'begin',
	endKey = 'end',
) => ({
	$or: [
		...intersectsInterval(begin, end, beginKey, endKey).$or,
		{
			[beginKey]: end,
		},
		{
			[endKey]: begin,
		},
	],
});

export default intersectsOrTouchesInterval;
