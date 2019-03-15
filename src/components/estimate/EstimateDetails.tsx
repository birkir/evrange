import { Box, Grid, RangeInput, Select, Text } from 'grommet';
import React from 'react';
import cars from '../../data/cars.json';

export const EstimateDetails = ({
  when,
  route,
  result,
  weather,
  children,
  config,
  onConfigChange,
}: any) => {
  const leg = route.direction.routes[0].legs[0];
  const { aggregated, steps } = result || { aggregated: {}, steps: [] };
  const totalConsumption = aggregated.totalConsumption || 0;
  const averageConsumption =
    (aggregated.averageConsumption || 1) / (steps.length || 1);

  const onSpeedChange = (e: any) =>
    onConfigChange({ ...config, speed: e.currentTarget.value });

  const onCarChange = (e: any) => {
    onConfigChange({ ...config, car: e.value });
  };

  return (
    <Box width="large" style={{ marginBottom: 16 }}>
      <Grid
        columns={{
          count: 2,
          size: 'auto',
        }}
        gap="small"
        fill
      >
        <Box background="brand" pad="small">
          <Text size="small">Trip</Text>
          <Text size="large">{leg.start_address}</Text>
          <Text size="large">
            <span style={{ fontSize: 20 }}>to </span> {leg.end_address}
          </Text>
          <br />
          <Text size="small">Distance</Text>
          <Text size="xlarge">{leg.distance.text}</Text>
          <br />
          <Text size="small">Duration in traffic</Text>
          <Text size="xlarge">{leg.duration_in_traffic.text}</Text>
          <br />
          {children}
          {/* <br />
          <Text size="small">Weather</Text>
          <Text size="xlarge">10 C - 5 m/s 80 DEG - </Text> */}
        </Box>
        <Box>
          <Box background="accent-1" pad="small" style={{ marginBottom: 12 }}>
            <Text>Total</Text>
            <Text size="xxlarge">
              {(totalConsumption / 1000).toFixed(2)} kW
            </Text>
          </Box>
          <Box background="accent-4" pad="small" style={{ marginBottom: 12 }}>
            <Text>Average</Text>
            <Text size="xxlarge">{Math.round(averageConsumption)} Wh/km</Text>
          </Box>
          <Box background="light-3" pad="small" style={{ marginBottom: 12 }}>
            <Select
              plain
              id="select"
              value={config.car.name}
              placeholder="Select car from the list"
              options={cars}
              onChange={onCarChange}
            >
              {value => (
                <Box direction="row" align="center" pad="small" flex={false}>
                  {value.name}
                </Box>
              )}
            </Select>
          </Box>
          <Box background="light-3" pad="small">
            <Box direction="row" justify="between">
              <Text size="small">Speed adjustment</Text>
              <Text size="small">{Math.floor(config.speed * 2) - 100}%</Text>
            </Box>
            <RangeInput
              step={5}
              min={0}
              max={100}
              value={config.speed}
              onChange={onSpeedChange}
            />
            {/* <Box direction="row" justify="between" style={{ marginTop: 16 }}>
              <Text size="small">Heater adjustment</Text>
              <Text size="small">1kWh/10°C</Text>
            </Box>
            <RangeInput min={0} max={100} value={50} /> */}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
