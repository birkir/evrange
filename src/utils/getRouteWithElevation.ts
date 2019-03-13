import polyline from '@mapbox/polyline';
import { uniqBy } from 'lodash';
import { GeoPoint } from './geoPointDistance';

const MIN_SPREAD_DISTANCE = 250;

export const getRouteWithElevation = async (res: any, googleMaps: any) =>
  new Promise(resolve => {
    const steps = res.routes[0].legs[0].steps;
    const minBasedOnDistance =
      res.routes[0].legs[0].distance.value / (500 - steps.length);
    const minDistanceBetweenElevationPoints = Math.max(
      MIN_SPREAD_DISTANCE,
      minBasedOnDistance
    );

    let nextPoint = 0;
    let dist = 0;

    const result = steps.map((step: any) => {
      const polypoints = polyline.decode(step.polyline.points);
      const part = step.distance.value / polypoints.length;
      // const polydistance = polypoints.slice(1).reduce((acc: any, p: any, index: number) => acc + geoPointDistance(polypoints[index], p), 0);

      const points = polypoints.reduce(
        (acc: GeoPoint[], point: GeoPoint) => {
          dist += part;
          if (dist > nextPoint) {
            nextPoint = dist + minDistanceBetweenElevationPoints;
            acc.push(new googleMaps.LatLng(point[0], point[1]));
          }
          return acc;
        },
        [step.start_location]
      );

      return {
        ...step,
        points: points.map((from: GeoPoint, index: 0, arr: GeoPoint[]) => {
          const next = arr[index + 1];
          const to = next ? next : step.end_location;
          return [from, to];
        }),
      };
    });

    const locations = uniqBy(
      result.reduce((acc: any, item: any) => {
        item.points.forEach((a: any) => a.forEach((n: any) => acc.push(n)));
        return acc;
      }, []),
      (l: any) => l.toUrlValue()
    );

    const elevationService = new googleMaps.ElevationService();
    elevationService.getElevationForLocations(
      { locations },
      (elevationData: any, status: string) => {
        if (status !== 'OK') {
          console.error('Elevation Status', status);
        }

        return resolve({
          direction: res,
          steps: result,
          elevationData,
          minDistanceBetweenElevationPoints,
        });
      }
    );
  });
