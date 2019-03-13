import { Stream } from '@nivo/stream';
import React from 'react';

export const EstimateResult = ({ result: { steps, aggregated } }: any) => {
  const data = steps.map((step: any) => {
    return {
      Incline: Math.round(step.consumption.inclineConsumption),
      'Rolling Resistance': Math.round(
        step.consumption.rollingResistanceConsumption
      ),
      'Wind Drag': Math.round(step.consumption.windDragConsumption),
      Motor: Math.round(step.consumption.motorConsumption),
      Inverter: Math.round(step.consumption.inverterConsumption),
      'Batter Discharge': Math.round(step.consumption.batteryDischarge),
    };
  });

  return (
    <div>
      <div style={{ marginLeft: -32 }}>
        <Stream
          data={data}
          width={800}
          height={400}
          keys={[
            'Incline',
            'Rolling Resistance',
            'Wind Drag',
            'Motor',
            'Inverter',
            'Batter Discharge',
          ]}
          margin={{
            top: 32,
            right: 0,
            bottom: 64,
            left: 32,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Watts',
            legendOffset: -40,
          }}
          offsetType="none"
          fillOpacity={0.85}
          borderColor="#000"
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#2c998f',
              size: 4,
              padding: 2,
              stagger: true,
            },
            {
              id: 'squares',
              type: 'patternSquares',
              background: 'inherit',
              color: '#e4c912',
              size: 6,
              padding: 2,
              stagger: true,
            },
          ]}
          dotSize={8}
          dotBorderWidth={2}
          dotBorderColor="inherit:brighter(0.7)"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          enableGridX={false}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateX: 0,
              translateY: 32,
              itemWidth: 120,
              itemHeight: 20,
              itemTextColor: '#999',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </div>
      <p>
        <strong>Notice</strong> Not encountering for regenerative charging or
        heating
      </p>
      <h4>
        Total:{' '}
        {aggregated.totalConsumption.toLocaleString('en-GB', {
          maximumFractionDigits: 0,
        })}{' '}
        Watts
      </h4>
      <h5>
        Average:{' '}
        {(aggregated.averageConsumption / steps.length).toLocaleString(
          'en-GB',
          { maximumFractionDigits: 0 }
        )}{' '}
        W/km
      </h5>
      <ul>
        <li>
          rollingResistance:{' '}
          {aggregated.rollingResistanceConsumption.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
          })}{' '}
          W
        </li>
        <li>
          windDrag:{' '}
          {aggregated.windDragConsumption.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
          })}{' '}
          W
        </li>
        <li>
          motor:{' '}
          {aggregated.motorConsumption.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
          })}{' '}
          W
        </li>
        <li>
          inverter:{' '}
          {aggregated.inverterConsumption.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
          })}{' '}
          W
        </li>
        <li>
          battery:{' '}
          {aggregated.batteryDischarge.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
          })}{' '}
          W
        </li>
        <li>
          incline:{' '}
          {aggregated.inclineConsumption.toLocaleString('en-GB', {
            maximumFractionDigits: 0,
          })}{' '}
          W
        </li>
      </ul>
    </div>
  );
};
