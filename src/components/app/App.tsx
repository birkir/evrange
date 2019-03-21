import DateFnsUtils from '@date-io/date-fns';
import { Box, Grommet } from 'grommet';
import * as themes from 'grommet-controls/themes';
import loadGoogleMapsApi from 'load-google-maps-api';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { getRouteWithElevation } from '../../utils/getRouteWithElevation';
import { getWeather } from '../../utils/getWeather';
import { nineties } from '../../utils/themes/nineties';
import { DirectionsInput } from '../directions-input/DirectionsInput';
import { DirectionsMap } from '../directions-map/DirectionsMap';
import { Estimate } from '../estimate/Estimate';

const qs = window.location.search
  .substr(1)
  .split('&')
  .reduce((acc: any, item: any) => {
    const [key, value] = item.split('=').map(decodeURIComponent);
    acc[key] = value;
    return acc;
  }, {});

function App() {
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [estimate, setEstimate] = useState<any>(null);

  let theme: any;
  if (qs.theme) {
    if (qs.theme === 'nineties') {
      theme = nineties;
    } else if (qs.theme === 'metro') {
      theme = themes.metro;
    } else if (qs.theme === 'materiallight') {
      theme = themes.materiallight;
    } else if (qs.theme === 'materialdark') {
      theme = themes.materialdark;
    } else if (qs.theme === 'light') {
      theme = themes.light;
    } else if (qs.theme === 'black') {
      theme = themes.black;
    }
  }

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
    <Grommet theme={theme}>
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
        <Box fill align="center" justify="center">
          <p>
            contact me{' '}
            <a
              href="https://github.com/birkir"
              target="blank"
              style={{ color: 'gray' }}
            >
              @birkir
            </a>
          </p>
        </Box>
      </MuiPickersUtilsProvider>
    </Grommet>
  );
}

export default hot(App);
