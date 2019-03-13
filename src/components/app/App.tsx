import DateFnsUtils from '@date-io/date-fns';
import { Grommet } from 'grommet';
import loadGoogleMapsApi from 'load-google-maps-api';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import React, { useEffect, useState } from 'react';
import { getConsumption } from '../../utils/getConsumption';
import { getElevation } from '../../utils/getElevation';
import { getWeather } from '../../utils/getWeather';
import { DirectionsInput } from '../directions-input/DirectionsInput';
import { Estimate } from '../estimate/Estimate';

export function App() {
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [consumption, setConsumption] = useState<any>(null);

  useEffect(() => {
    loadGoogleMapsApi({ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }).then(
      setGoogleMaps
    );
  }, []);

  const onDirectionsSubmit = async ({ origin, destination, when }: any) => {
    const directionService = new googleMaps.DirectionsService();
    directionService.route(
      {
        origin,
        destination,
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: when,
        },
      },
      async (res: any) => {
        if (res.status === 'NOT_FOUND') {
          // not found
          alert('Location not found');
          return;
        }

        const elevation = await getElevation(res, googleMaps);
        const weather = await getWeather(res);

        getConsumption(res, elevation, weather).then(setConsumption);
      }
    );
  };

  return (
    <div style={{ margin: 16 }}>
      <Grommet>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {consumption ? (
            <Estimate consumption={consumption} />
          ) : (
            <DirectionsInput onSubmit={onDirectionsSubmit} />
          )}
        </MuiPickersUtilsProvider>
      </Grommet>
    </div>
  );
}
