import polyline from '@mapbox/polyline';
import { GeoPoint, geoPointDistance } from './geoPointDistance';

const minDistanceBetweenElevationPoints = 250;

export const getElevation = async (res: any, googleMaps: any) =>
  new Promise(resolve => {
    const result = res.routes[0].legs[0].steps.map((step: any) => {
      const points = polyline.decode(step.polyline.points).reduce(
        (acc: GeoPoint[], point: GeoPoint) => {
          const dist = geoPointDistance(acc[acc.length - 1], point);
          if (dist > minDistanceBetweenElevationPoints) {
            acc.push(point);
          }
          return acc;
        },
        [[step.start_location.lat(), step.start_location.lng()]]
      );

      return {
        ...step,
        points: points.map((from: GeoPoint, index: 0, arr: GeoPoint[]) => {
          const next = arr[index + 1];
          const to = next
            ? next
            : [step.end_location.lat(), step.end_location.lng(), 'NO NEXT'];
          return [from, to];
        }),
      };
    });

    const locations = result.reduce((acc: any, item: any) => {
      item.points.forEach((a: any) =>
        a.forEach((n: any) => acc.push(new googleMaps.LatLng(n[0], n[1])))
      );
      return acc;
    }, []);

    const elevationService = new googleMaps.ElevationService();
    elevationService.getElevationForLocations(
      { locations },
      (elevationData: any) => resolve({ steps: result, elevationData })
    );
  });
