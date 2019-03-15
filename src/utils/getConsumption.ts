import { cardinalDirection } from '../math/cardinalDirection';
import { Consumption } from '../models/Consumption';
import { geoPointDistance } from './geoPointDistance';

export const getConsumption = ({ route, weather, when, config }: any) => {
  const { steps, elevationData } = route;
  let i = 0;
  let totalDistance = 0;
  let totalDuration = 0;
  const result: any[] = [];
  const speedsterPow = 1 + (config.speed * 0.02 - 1) * 0.1;

  let totalBatteryCapacity = config.car.configuration.batteryCapacity || 0;

  steps.forEach((step: any) => {
    // find closest weather
    const s1 = [step.start_location.lat(), step.start_location.lng()];
    const s2 = [step.end_location.lat(), step.end_location.lng()];
    const center: [number, number] = [(s1[0] + s2[0]) / 2, (s1[1] - s2[1]) / 2];

    // find closest weather by location
    const closestWeather = weather
      .map((w: any) => ({
        distance: geoPointDistance(center, w.geopoint),
        ...w,
      }))
      .sort((a: any, b: any) => a.distance - b.distance)
      .shift().weather.list;

    // Find correct weather by time
    const dt = Math.round(when.getTime() / 1000);
    const currentWeather =
      closestWeather.find((w: any) => w.dt > dt) || closestWeather.pop();

    const speedInKmPerHour =
      (((step.distance.value / step.duration.value) * 3600) / 1000) **
      speedsterPow;

    let sumElv = 1;
    step.points.forEach((point: any, index: number, arr: any) => {
      const a: [number, number] = [point[0].lat(), point[0].lng()];
      const b: [number, number] = [point[1].lat(), point[1].lng()];
      const distance = geoPointDistance(a, b);
      const duration = (distance / step.distance.value) * step.duration.value;

      const elv = point.map((p: any) => {
        return elevationData.find((ep: any) => ep.location.equals(p));
      });

      if (!elv[0] && elv[1]) {
        elv[0] = elv[1];
      } else if (!elv[1] && elv[0]) {
        elv[1] = elv[0];
      } else if (!elv[0] && !elv[1]) {
        elv[0] = elv[1] = { elevation: sumElv / (index + 1) };
      }

      const rise = elv[1].elevation - elv[0].elevation;
      const grade = rise / distance;
      const heightAboveReference = (elv[1].elevation + elv[0].elevation) / 2;
      const windSpeed = currentWeather.wind.speed;
      const windDirection = currentWeather.wind.deg;
      const temperatureInCelcius = currentWeather.main.temp - 273.15;
      const relativeHumidity = currentWeather.main.humidity;
      const absoluteAirPressureInPascal = currentWeather.main.pressure * 100;

      sumElv += heightAboveReference;

      const consumption = Consumption.create({
        inclineInPercent: grade * 100,
        heightAboveReference,
        speedInKmPerHour,
        windSpeed,
        windDirection,
        temperatureInCelcius,
        relativeHumidity,
        absoluteAirPressureInPascal,
        cardinalDirection: cardinalDirection(a, b),
        distance,
        ...config.car.configuration,
      } as any);

      result.push({
        i,
        distance: totalDistance,
        duration: totalDuration,
        battery: totalBatteryCapacity,
        point,
        consumption,
      });

      i++;
      totalBatteryCapacity -= consumption.totalConsumption;
      totalDistance += distance;
      totalDuration += duration;
    });
  });

  const aggregateKeys = [
    'averageConsumption',
    'totalConsumption',
    'rollingResistanceConsumption',
    'windDragConsumption',
    'motorConsumption',
    'inverterConsumption',
    'batteryDischarge',
    'inclineConsumption',
    'heaterConsumption',
  ];

  const aggregated = result.reduce((acc, item) => {
    aggregateKeys.forEach(key => {
      if (key === 'totalConsumption') {
        acc[key] = (acc[key] || 0) + item.consumption[key];
      } else {
        acc[key] =
          (acc[key] || 0) +
          (item.consumption[key] * item.consumption.distance) / 1000;
      }
    });
    return acc;
  }, {});

  return { aggregated, steps: result };
};
