import DateFnsUtils from '@date-io/date-fns';
import { Grommet } from 'grommet';
import loadGoogleMapsApi from 'load-google-maps-api';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { getRouteWithElevation } from '../../utils/getRouteWithElevation';
import { getWeather } from '../../utils/getWeather';
import { DirectionsInput } from '../directions-input/DirectionsInput';
import { Estimate } from '../estimate/Estimate';

function App() {
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [estimate, setEstimate] = useState<any>(null);

  useEffect(() => {
    loadGoogleMapsApi({ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }).then(
      setGoogleMaps
    );
  }, []);

  const onResetClick = () => {
    setEstimate(null);
    setRoute(null);
    setWeather(null);
  };

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

        setRoute(await getRouteWithElevation(res, googleMaps));
        setWeather(await getWeather(res));
        setEstimate({ when });
      }
    );
  };

  return (
    <div style={{ margin: 16 }}>
      <Grommet>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {estimate ? (
            <Estimate
              route={route}
              weather={weather}
              when={estimate.when}
              onReset={onResetClick}
            />
          ) : (
            <DirectionsInput onSubmit={onDirectionsSubmit} />
          )}
        </MuiPickersUtilsProvider>
      </Grommet>
    </div>
  );
}

export default hot(App);
