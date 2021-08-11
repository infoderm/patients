import React from 'react';
import {BarStack} from '@visx/shape';
import {Group} from '@visx/group';
import {Grid} from '@visx/grid';
import {AxisBottom} from '@visx/axis';
import {scaleBand, scaleLinear} from '@visx/scale';
import {useTooltip, TooltipWithBounds} from '@visx/tooltip';
import {LegendOrdinal} from '@visx/legend';
import {localPoint} from '@visx/event';

import {sum, max} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';
import {increasing} from '@total-order/primitive';

const percentage = (p) => `${(p * 100).toPrecision(4)}%`;

interface Margin {
	top?: number;
	left?: number;
}

interface Props {
	width: number;
	height: number;
	margin?: Margin;
	data: any[];
	color: any;
}

const StackedBarChart = ({width, height, margin, data, color}: Props) => {
	const {
		tooltipOpen,
		tooltipLeft,
		tooltipTop,
		tooltipData,
		hideTooltip,
		showTooltip,
	} = useTooltip<{key: any; bar: any}>();

	if (width < 10) {
		return <>Cannot display chart on such small dimensions</>;
	}

	margin = margin ?? {};
	margin.top = margin.top ?? 40;

	// Accessors
	const keysFn = (item) => Object.keys(item).filter((d) => d !== 'key');
	const keySet = new Set();
	const x = (d) => d.key;

	// Totals
	let total = 0;
	const totals = {};
	for (const item of data) {
		const itemKeys = keysFn(item);
		for (const key of itemKeys) keySet.add(key);
		const t = sum(map((key) => item[key], itemKeys));
		totals[item.key] = t;
		total += t;
	}

	const keys = [...keySet] as string[];

	// Bounds
	const xMax = width;
	const yMax = height - margin.top - 100;

	// Scales
	const xScale = scaleBand({
		domain: data.map(x),
		range: [0, xMax],
		padding: 0.2,
	});
	const yScale = scaleLinear({
		domain: [0, max(increasing, Object.values(totals)) ?? 1],
		range: [yMax, 0],
		nice: true,
	});

	let tooltipTimeout;

	return (
		<>
			<svg width={width} height={height}>
				<rect
					x={0}
					y={0}
					width={width}
					height={height}
					fill="#eaedff"
					rx={14}
				/>
				<Grid
					top={margin.top}
					left={margin.left}
					xScale={xScale}
					yScale={yScale}
					width={xMax}
					height={yMax}
					stroke="black"
					strokeOpacity={0.1}
					xOffset={xScale.bandwidth() / 2}
				/>
				<Group top={margin.top}>
					<BarStack
						data={data}
						keys={keys}
						x={x}
						xScale={xScale}
						yScale={yScale}
						color={color}
					>
						{(barStacks) =>
							barStacks.map((barStack) =>
								barStack.bars.map((bar) => (
									<rect
										key={`bar-stack-${barStack.index}-${bar.index}`}
										x={bar.x}
										y={bar.y}
										height={bar.height}
										width={bar.width}
										fill={bar.color}
										onMouseLeave={() => {
											tooltipTimeout = window.setTimeout(() => {
												hideTooltip();
											}, 300);
										}}
										onMouseMove={(event) => {
											if (tooltipTimeout) clearTimeout(tooltipTimeout);
											const coords = localPoint(event);
											if (!coords) return;
											const top = coords.y;
											const left = bar.x + bar.width / 2;
											showTooltip({
												tooltipData: bar,
												tooltipTop: top,
												tooltipLeft: left,
											});
										}}
									/>
								)),
							)
						}
					</BarStack>
				</Group>
				<AxisBottom
					scale={xScale}
					top={yMax + margin.top}
					stroke="#a44afe"
					tickStroke="#a44afe"
					tickLabelProps={(_value, _index) => ({
						fill: '#a44afe',
						fontSize: 11,
						textAnchor: 'middle',
					})}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					top: margin.top / 2 - 10,
					width,
					display: 'flex',
					justifyContent: 'center',
					fontSize: '14px',
				}}
			>
				{data.length > 0 && (
					<LegendOrdinal
						scale={color}
						direction="row"
						labelMargin="0 15px 0 0"
					/>
				)}
			</div>
			{tooltipOpen && (
				<TooltipWithBounds top={tooltipTop} left={tooltipLeft}>
					{`${tooltipData.key}: ${
						tooltipData.bar.data[tooltipData.key]
					} (${percentage(
						tooltipData.bar.data[tooltipData.key] /
							totals[tooltipData.bar.data.key],
					)} ~ ${percentage(tooltipData.bar.data[tooltipData.key] / total)})`}
				</TooltipWithBounds>
			)}
		</>
	);
};

export default StackedBarChart;
