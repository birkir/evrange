import { Box } from 'grommet';
import Highcharts from 'highcharts';
import { featureGroup, LatLng } from 'leaflet';
import React, { useEffect } from 'react';
import { Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

export const DirectionsMap = ({ config, steps, pois }: any) => {
  const position: [number, number] = [
    (steps[0].point[0].lat() + steps[steps.length - 2].point[0].lat()) / 2,
    (steps[0].point[0].lng() + steps[steps.length - 2].point[0].lng()) / 2,
  ];

  const [min, max] = steps.reduce(
    (acc: any, x: any) => {
      acc[0] = Math.min(acc[0], x.consumption.totalConsumption);
      acc[1] = Math.max(acc[1], x.consumption.totalConsumption);
      return acc;
    },
    [Infinity, -Infinity]
  );

  const getColor = (val: number) => {
    const hue = val > 0 ? 120 - (val / max) * 120 : (val / min) * 200;
    return `hsl(${hue}, 75%, 50%)`;
  };

  return (
    <Box width="large" align="center">
      <Map
        center={position}
        zoom={9}
        style={{ width: '100%', height: 400, zIndex: 0 }}
      >
        <TileLayer
          attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {steps.map((step: any, index: number) => (
          <Polyline
            key={index}
            smoothFactor={2}
            color={getColor(step.consumption.totalConsumption)}
            positions={[
              new LatLng(step.point[0].lat(), step.point[0].lng()),
              new LatLng(step.point[1].lat(), step.point[1].lng()),
            ]}
          />
        ))}

        {pois.map((poi: any, index: number) => (
          <Marker position={[poi.latitude, poi.longitude]} key={index}>
            <Popup>
              <h4>{poi.name}</h4>
              <p>Distance: {(poi.l.distance / 1000).toFixed(2)} km</p>
              <p>
                Charge: {(poi.l.battery / 1000).toFixed(2)} kWh /{' '}
                {Math.round(
                  (poi.l.battery / config.car.configuration.batteryCapacity) *
                    100
                )}
                %
              </p>
            </Popup>
          </Marker>
        ))}
      </Map>
    </Box>
  );
};
