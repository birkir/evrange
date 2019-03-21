import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { Box, Text } from 'grommet';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { DirectionsMap } from '../directions-map/DirectionsMap';

Highcharts.Pointer.prototype.reset = () => undefined;

const onHighchartsCreated = (chart: any) => {
  ['mousemove', 'touchmove', 'touchstart'].forEach((eventType: any) => {
    chart.renderTo.addEventListener(eventType, (e: any) => {
      for (const c of Highcharts.charts) {
        if (c) {
          const ev = c.pointer.normalize(e);
          const point = (c.series[0] as any).searchPoint(ev, true);
          if (point) {
            const event = point.series.chart.pointer.normalize(e);
            point.onMouseOver();
            point.series.chart.tooltip.refresh(point);
            point.series.chart.xAxis[0].drawCrosshair(event, point);
          }
        }
      }
    });
  });
};

export const EstimateResult = ({
  config,
  result: { steps, aggregated, pois },
}: any) => {
  const consumptionSeries = [
    {
      data: steps.map((step: any) => [
        step.distance / 1000,
        Math.round(step.consumption.averageConsumption),
      ]),
      tooltip: {
        valueSuffix: ' W',
      },
      type: 'spline',
      color: Highcharts.getOptions().colors![0],
    },
  ] as any;

  const batterySeries = [
    {
      data: steps.map((step: any) => [
        step.distance / 1000,
        Number((step.battery / 1000).toFixed(2)),
      ]),
      tooltip: {
        valueSuffix: ' kWh',
      },
      type: 'area',
      color: Highcharts.getOptions().colors![5],
    },
  ] as any;

  const speedSeries = [
    {
      data: steps.map((step: any) => [
        step.distance / 1000,
        Math.round(step.consumption.speedInKmPerHour),
      ]),
      tooltip: {
        valueSuffix: ' km/h',
      },
      type: 'spline',
      color: Highcharts.getOptions().colors![1],
    },
  ] as any;

  const elevationSeries = [
    {
      data: steps.map((step: any) => [
        step.distance / 1000,
        Math.round(step.consumption.heightAboveReference),
      ]),
      tooltip: {
        valueSuffix: ' m',
      },
      color: Highcharts.getOptions().colors![2],
    },
  ] as any;

  const options: Highcharts.Options = {
    title: {
      text: 'Average Consumption',
      align: 'left',
      margin: 0,
      x: 0,
    },
    tooltip: {
      positioner() {
        return {
          x: (this as any).chart.chartWidth - (this as any).label.width,
          y: 10,
        };
      },
      borderWidth: 0,
      backgroundColor: 'none',
      pointFormat: '{point.y}',
      headerFormat: '',
      shadow: false,
      style: {
        fontSize: '18px',
      },
    },
    chart: {
      height: 300,
      marginLeft: 0,
      spacingTop: 20,
      spacingBottom: 0,
      backgroundColor: 'transparent',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      crosshair: true,
      labels: {
        format: '{value} km',
      },
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    legend: {
      enabled: false,
    },
  };

  const factor = steps[steps.length - 1].distance / 1000;

  const rows = [
    {
      name: 'Consumption (Total)',
      value: aggregated.averageConsumption / factor,
      unit: 'Wh/km',
    },
    {
      name: 'Consumption from incline',
      value: aggregated.inclineConsumption / factor,
      unit: 'Wh/km',
    },
    {
      name: 'Consumption from battery discharge heat',
      value: aggregated.batteryDischarge / factor,
      unit: 'Wh/km',
    },
    {
      name: 'Consumption from DC to AC inverter for motor power',
      value: aggregated.inverterConsumption / factor,
      unit: 'Wh/km',
    },
    {
      name: 'Consumption from motor',
      value: aggregated.motorConsumption / factor,
      unit: 'Wh/km',
    },
    {
      name: 'Consumption from wind drag',
      value: aggregated.windDragConsumption / factor,
      unit: 'Wh/km',
    },
    {
      name: 'Consumption from tyre drag',
      value: aggregated.rollingResistanceConsumption / factor,
      unit: 'Wh/km',
    },
  ];

  return (
    <>
      <DirectionsMap config={config} pois={pois} steps={steps} />
      <Box width="large" style={{ marginBottom: 16 }}>
        <Paper style={{ padding: 16 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...options,
              title: { ...options.title, text: 'Consumption' },
              series: consumptionSeries,
            }}
            callback={onHighchartsCreated}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...options,
              title: { ...options.title, text: 'Capacity' },
              series: batterySeries,
            }}
            callback={onHighchartsCreated}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...options,
              title: { ...options.title, text: 'Speed' },
              series: speedSeries,
            }}
            callback={onHighchartsCreated}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...options,
              title: { ...options.title, text: 'Elevation' },
              series: elevationSeries,
            }}
            callback={onHighchartsCreated}
          />
        </Paper>
      </Box>
      <Box width="large">
        <Paper>
          <Table>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    <Text size="small">{row.name}</Text>
                  </TableCell>
                  <TableCell align="right" padding="none">
                    <Text>{row.value.toFixed(1)}</Text>
                  </TableCell>
                  <TableCell align="right" style={{ width: 50 }}>
                    <Text>{row.unit}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
};
