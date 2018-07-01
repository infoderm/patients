import React from 'react';
import { BarStack } from '@vx/shape';
import { Group } from '@vx/group';
import { Grid } from '@vx/grid';
import { AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { LegendOrdinal } from '@vx/legend';
import { extent, max } from 'd3-array';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';

import { sum , map } from '@aureooms/js-itertools';
import { at_least } from '@aureooms/js-cardinality';

export default withTooltip(
  ({
    width,
    height,
    events = false,
    margin = {
      top: 40
    },
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
    data,
  }) => {

    if (width < 10) return 'Cannot display chart on such small dimensions';

    if (!at_least(1, data)) return 'Not enough data to display chart';

    // accessors
    const keys = Object.keys(data[0]).filter(d => d !== 'key');
    const x = d => d.key;

    // totals
    const totals = [ ] ;
    for ( const item of data ) totals.push(sum(map(key => item[key], keys)));

    // bounds
    const xMax = width;
    const yMax = height - margin.top - 100;

    // scales
    const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain: data.map(x),
      padding: 0.2,
      tickFormat: () => val => val,
    });
    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      nice: true,
      domain: [0, max(totals)],
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: [blue[500], pink[500], purple[500], grey[500]],
    });

    let tooltipTimeout;

    return (
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={`#eaedff`} rx={14} />
          <Grid
            top={margin.top}
            left={margin.left}
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke={'black'}
            strokeOpacity={0.1}
            xOffset={xScale.bandwidth() / 2}
          />
          <BarStack
            top={margin.top}
            data={data}
            keys={keys}
            height={yMax}
            x={x}
            xScale={xScale}
            yScale={yScale}
            zScale={zScale}
            onClick={data => event => {
              if (!events) return;
              alert(`clicked: ${JSON.stringify(data)}`);
            }}
            onMouseLeave={data => event => {
              tooltipTimeout = setTimeout(() => {
                hideTooltip();
              }, 300);
            }}
            onMouseMove={data => event => {
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              const top = event.clientY - margin.top - data.height;
              const left = xScale(data.x) + data.width + data.paddingInner * data.step / 2;
              showTooltip({
                tooltipData: data,
                tooltipTop: top,
                tooltipLeft: left
              });
            }}
          />
          <AxisBottom
            scale={xScale}
            top={yMax + margin.top}
            stroke="#a44afe"
            tickStroke="#a44afe"
            tickLabelProps={(value, index) => ({
              fill: '#a44afe',
              fontSize: 11,
              textAnchor: 'middle'
            })}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: margin.top / 2 - 10,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px'
          }}
        >
          <LegendOrdinal scale={zScale} direction="row" labelMargin="0 15px 0 0" />
        </div>
        {tooltipOpen && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              minWidth: 60,
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: 'white'
            }}
          >
            <div style={{ color: zScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.data[tooltipData.key]}</div>
            <div>
              <small>{tooltipData.xFormatted}</small>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);
