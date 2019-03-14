import { Box, Button, Heading } from 'grommet';
import React, { useEffect, useState } from 'react';
import { getConsumption } from '../../utils/getConsumption';
import { EstimateDetails } from './EstimateDetails';
import { EstimateResult } from './EstimateResult';

const Loading = () => <p>Loading...</p>;

export const Estimate = ({ route, weather, when, onReset }: any) => {
  const [consumption, setConsumption] = useState<any>(null);
  const [speedster, setSpeedster] = useState(50);

  useEffect(() => {
    setConsumption(getConsumption({ route, weather, when, speedster }));
  }, [speedster]);

  const leg = route.direction.routes[0].legs[0];

  return (
    <Box fill align="center" justify="center">
      <Heading level="3">Estimate Results</Heading>
      <EstimateDetails
        when={when}
        route={route}
        weather={weather}
        result={consumption}
      />
      <Box width="large" style={{ marginBottom: 16 }}>
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d223553.04694320163!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m3!3m2!1d${leg.start_location.lat()}!2d${leg.start_location.lng()}!4m3!3m2!1d${leg.end_location.lat()}!2d${leg.end_location.lng()}!5e0!3m2!1sen!2sus!4v1552595264691`}
          width="100%"
          height="360"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
        />
      </Box>
      {!consumption ? <Loading /> : <EstimateResult result={consumption} />}
      <Box pad="medium" justify="center" align="center">
        <Button label="Go back" onClick={onReset} />
      </Box>
    </Box>
  );
};
