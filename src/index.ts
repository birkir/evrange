import { Consumption } from './models/Consumption';
import route from './routes/route1.json';
import elevation from './routes/elevations1.json';
import weatherEnd from './routes/weather.end.json';

interface GeoPoint {
  lat: number;
  lng: number;
}

const angleFromGeoPoints = (a: GeoPoint, b: GeoPoint) => {
  const dLon = (b.lng - a.lng);
  const y = Math.sin(dLon) * Math.cos(b.lat);
  const x = Math.cos(a.lat) * Math.sin(b.lat) - Math.sin(a.lat) * Math.cos(b.lat) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  return (brng > 0 ? brng : (2 * Math.PI + brng)) * 360 / (2 * Math.PI);
}

let total = 0;

route.routes[0].legs[0].steps.forEach(step => {
  const startElevation = elevation.results.find(el => el.location.lat === step.start_location.lat && el.location.lng === step.start_location.lng);
  const endElevation = elevation.results.find(el => el.location.lat === step.end_location.lat && el.location.lng === step.end_location.lng);
  const riseMeters = endElevation.elevation - startElevation.elevation;
  const grade = riseMeters / step.distance.value;
  const speedMsec = step.distance.value / step.duration.value;
  
  // do you drive fast or slow?
  const speedster = 1.0;

  const weather = weatherEnd.list.find(item => item.dt === 1552489200);

  const consumption = Consumption.create({
    inclineInPercent: grade * 100,
    heightAboveReference: (startElevation.elevation + endElevation.elevation) / 2,
    speedInKmPerHour: speedMsec * 3600 / 1000 * speedster,
    cardinalDirection: angleFromGeoPoints(step.start_location, step.end_location),
    windSpeed: weather.wind.speed,
    windDirection: weather.wind.deg,
    temperatureInCelcius: weather.main.temp - 273.15,
    relativeHumidity: weather.main.humidity,
    absoluteAirPressureInPascal: weather.main.pressure * 100,
  } as any);

  total += consumption.totalConsumption * step.distance.value / 1000;

  console.log('%s    \t%s\t%s:  \t%o W', step.distance.text, (grade * 100).toFixed(1), step.duration.text, Math.round(consumption.totalConsumption * step.distance.value / 1000));
})

console.log();
console.log('total: %o kW', Number((total / 1000).toFixed(2)));