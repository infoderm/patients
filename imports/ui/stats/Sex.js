import React from 'react';
import {Pie} from '@visx/shape';
import {Group} from '@visx/group';
import {scaleOrdinal} from '@visx/scale';
// import {Legend, LegendOrdinal, LegendItem, LegendLabel} from '@visx/legend';
import {useTooltip, TooltipWithBounds} from '@visx/tooltip';
import {localPoint} from '@visx/event';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';

import useSexStats from './useSexStats.js';

// const legendGlyphSize = 15;

const Label = ({x, y, children}) => {
	return (
		<text
			fill="white"
			textAnchor="middle"
			x={x}
			y={y}
			dy=".33em"
			fontSize={22}
			pointerEvents="none"
		>
			{children}
		</text>
	);
};

const Chart = ({width, height, ...rest}) => {
	const {
		tooltipData,
		tooltipLeft,
		tooltipTop,
		tooltipOpen,
		showTooltip,
		hideTooltip
	} = useTooltip();

	const {loading, total: allCount, count} = useSexStats();

	if (width < 10) {
		return 'Cannot display chart on such small dimensions';
	}

	const handleMouseMove = (datum) => (event) => {
		const coords = localPoint(event.target.ownerSVGElement, event);
		showTooltip({
			tooltipLeft: coords.x,
			tooltipTop: coords.y,
			tooltipData: datum
		});
	};

	const radius = Math.min(width, height) / 2;
	const sex = [];
	const loadingText = 'Loading...';
	const noDataText = 'No data';
	if (loading) {
		sex.push({sex: loadingText, freq: 1});
	} else if (!allCount) {
		sex.push({sex: noDataText, freq: 1});
	} else {
		for (const s of ['female', 'male', 'other', '']) {
			if (count[s]) {
				sex.push({
					sex: s || 'none',
					label: (s || 'none')[0].toUpperCase(),
					count: count[s],
					freq: count[s] / allCount
				});
			}
		}
	}

	const ordinalColorScale = scaleOrdinal({
		domain: ['female', 'male', 'other', 'none', loadingText, noDataText],
		range: [pink[500], blue[500], purple[500], grey[500], grey[500], grey[500]]
	});

	return (
		<div {...rest}>
			<svg width={width} height={height}>
				<Group top={height / 2} left={width / 2}>
					<Pie data={sex} pieValue={(d) => d.freq} outerRadius={radius}>
						{(pie) => {
							return pie.arcs.map((arc, index) => {
								const {sex, label} = arc.data;
								const [centroidX, centroidY] = pie.path.centroid(arc);
								const hasSpaceForLabel = true; // Arc.endAngle - arc.startAngle >= 0.1;
								const arcPath = pie.path(arc);
								const arcFill = ordinalColorScale(sex);
								return (
									<g key={`arc-${sex}-${index}`}>
										<path
											d={arcPath}
											fill={arcFill}
											onMouseMove={handleMouseMove(arc.data)}
											onMouseOut={hideTooltip}
										/>
										{hasSpaceForLabel && (
											<Label x={centroidX} y={centroidY}>
												{label ?? sex}
											</Label>
										)}
									</g>
								);
							});
						}}
					</Pie>
				</Group>
			</svg>
			{!loading && tooltipOpen && (
				<TooltipWithBounds top={tooltipTop} left={tooltipLeft}>
					{`${tooltipData.sex}: ${tooltipData.count} (${(
						tooltipData.freq * 100
					).toPrecision(4)}%)`}
				</TooltipWithBounds>
			)}
		</div>
	);
};

export default Chart;

// <LegendOrdinal scale={ordinalColorScale}>
// {labels => (
// <div style={{display: 'flex', flexDirection: 'column'}}>
// {labels.map((label, i) => (
// <LegendItem
// key={i}
// margin="0 5px"
// onClick={() => {
// alert(`clicked: ${JSON.stringify(label)}`);
// }}
// >
// <svg width={legendGlyphSize} height={legendGlyphSize}>
// <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
// </svg>
// <LegendLabel align="left" margin="0 0 0 4px">
// {label.text}
// </LegendLabel>
// </LegendItem>
// ))}
// </div>
// )}
// </LegendOrdinal>
