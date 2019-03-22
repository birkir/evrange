import { Box } from 'grommet';
import { DivIcon, latLng, latLngBounds } from 'leaflet';
import React from 'react';
import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Map,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';

export const DirectionsMap = ({ config, steps, pois }: any) => {
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

  const getBounds = () => {
    return latLngBounds(
      latLng(steps[0].point[0].lat(), steps[0].point[0].lng()),
      latLng(
        steps[steps.length - 2].point[1].lat(),
        steps[steps.length - 2].point[1].lng()
      )
    );
  };

  return (
    <Box width="large" align="center">
      <Map
        // center={position}
        // zoom={9}
        style={{ width: '100%', height: 400, zIndex: 0 }}
        bounds={getBounds()}
        boundsOptions={{ padding: [50, 50] }}
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
              latLng(step.point[0].lat(), step.point[0].lng()),
              latLng(step.point[1].lat(), step.point[1].lng()),
            ]}
          />
        ))}
        {pois.map(
          (poi: any, index: number) =>
            poi.selected && (
              <Marker position={[poi.latitude, poi.longitude]} key={index}>
                <Popup>
                  <h4 style={{ marginBottom: 4 }}>{poi.name}</h4>
                  <div>
                    Distance: {(poi.l.distance / 1000).toFixed(2)} km
                    <br />
                    Charge: {(poi.realBattery / 1000).toFixed(2)} kWh /{' '}
                    {Math.round(
                      (poi.realBattery /
                        config.car.configuration.batteryCapacity) *
                        100
                    )}
                    %<br />
                    Charge to 80% here
                    <br />
                    (minimum charge for next station:{' '}
                    {Math.round(
                      (poi.minCharge /
                        config.car.configuration.batteryCapacity) *
                        100
                    )}
                    %)
                  </div>
                </Popup>
              </Marker>
            )
        )}
        <LayersControl position="topright">
          <LayersControl.Overlay
            checked={false}
            name="Show all charging stations"
          >
            <LayerGroup>
              {pois.map(
                (poi: any, index: number) =>
                  !poi.selected && (
                    <Marker
                      icon={
                        new DivIcon({
                          className: 'chargepoint',
                          html:
                            '<span class="map-icon map-icon-electrician"></span>',
                        })
                      }
                      position={[poi.latitude, poi.longitude]}
                      key={index}
                    >
                      <Popup>
                        <h4 style={{ marginBottom: 4 }}>{poi.name}</h4>
                      </Popup>
                    </Marker>
                  )
              )}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    </Box>
  );
};
