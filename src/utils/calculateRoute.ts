import polyline from '@mapbox/polyline';
import elevation from '../data/elevation.json';
import route from '../data/route.json';
import weather from '../data/weather.json';
import { cardinalDirection } from '../math/cardinalDirection';
import { Consumption } from '../models/Consumption';
import { GeoPoint, geoPointDistance } from './geoPointDistance';

const currentWeather = weather.list.find(item => item.dt === 1552489200)!;

export const calculateRoute = (speedster = 1.0) => {
  const minDistanceBetweenElevationPoints = 250; // meters

  const result = route.routes[0].legs[0].steps.map(step => {
    const points = polyline.decode(step.polyline.points).reduce(
      (acc: GeoPoint[], point: GeoPoint) => {
        const dist = geoPointDistance(acc[acc.length - 1], point);
        if (dist > minDistanceBetweenElevationPoints) {
          acc.push(point);
        }
        return acc;
      },
      [[step.start_location.lat, step.start_location.lng]]
    );

    return {
      ...step,
      points: points.map((from: GeoPoint, index: 0, arr: GeoPoint[]) => {
        const next = arr[index + 1];
        const to = next
          ? next
          : [step.end_location.lat, step.end_location.lng, 'NO NEXT'];
        return [from, to];
      }),
    };
  });

  // elevation points
  const elevations = result
    .reduce((acc: string[], item: any) => {
      acc.push(item.points.map((n: any) => n.join('|')).join('|'));
      return acc;
    }, [])
    .join('|');

  let travelDistance = 0;

  return result.map(step => {
    const speedInKmPerHour =
      (((step.distance.value / step.duration.value) * 3600) / 1000) * speedster;
    const windSpeed = currentWeather.wind.speed;
    const windDirection = currentWeather.wind.deg;
    const temperatureInCelcius = currentWeather.main.temp - 273.15;
    const relativeHumidity = currentWeather.main.humidity;
    const absoluteAirPressureInPascal = currentWeather.main.pressure * 100;

    // consumption base!
    let startElevation = elevation.results.find(
      el =>
        el.location.lat === step.start_location.lat &&
        el.location.lng === step.start_location.lng
    )!;
    let endElevation = elevation.results.find(
      el =>
        el.location.lat === step.end_location.lat &&
        el.location.lng === step.end_location.lng
    )!;
    let riseMeters = endElevation.elevation - startElevation.elevation;
    let grade = riseMeters / step.distance.value;
    let heightAboveReference =
      (startElevation.elevation + endElevation.elevation) / 2;

    const speedMsec = step.distance.value / step.duration.value;

    const consumption = Consumption.create({
      inclineInPercent: grade * 100,
      heightAboveReference,
      speedInKmPerHour: ((speedMsec * 3600) / 1000) * speedster,
      cardinalDirection: cardinalDirection(
        [step.start_location.lat, step.start_location.lng],
        [step.end_location.lat, step.end_location.lng]
      ),
      windSpeed,
      windDirection,
      temperatureInCelcius,
      relativeHumidity,
      absoluteAirPressureInPascal,
      distance: step.distance.value,
    } as any);

    const consumptionSteps = step.points.map(
      ([a, b]: [GeoPoint, GeoPoint], index: number, arr: any) => {
        startElevation = elevation.results.find(
          el => el.location.lat === a[0] && el.location.lng === a[1]
        )!;
        endElevation = elevation.results.find(
          el => el.location.lat === b[0] && el.location.lng === b[1]
        )!;

        if (startElevation && endElevation) {
          riseMeters = endElevation.elevation - startElevation.elevation;
          grade = riseMeters / step.distance.value;
          heightAboveReference =
            (startElevation.elevation + endElevation.elevation) / 2;
        }

        // const dist = step.distance.value / step.points.length;
        // todo: adjust speed based on cornering/speed limit/speed cameras/traffic info

        const stepConsumption = Consumption.create({
          inclineInPercent: grade * 100,
          heightAboveReference,
          speedInKmPerHour,
          windSpeed,
          windDirection,
          temperatureInCelcius,
          relativeHumidity,
          absoluteAirPressureInPascal,
          cardinalDirection: cardinalDirection(a, b),
          distance:
            arr.length === 1 ? step.distance.value : geoPointDistance(a, b),
        } as any);

        travelDistance += stepConsumption.distance;

        return {
          consumption: stepConsumption,
          start: { point: a, elevation: startElevation },
          end: { point: b, elevation: endElevation },
          rise: riseMeters,
          travelDistance,
        };
      }
    );

    return {
      ...step,
      consumption,
      consumptionSteps,
    };
  });
};
