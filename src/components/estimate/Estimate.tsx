import { Box, Button, DataTable, Heading } from 'grommet';
import React, { useEffect, useState } from 'react';
import { getConsumption } from '../../utils/getConsumption';
import { EstimateDetails } from './EstimateDetails';
import { EstimateResult } from './EstimateResult';

const Loading = () => <p>Loading...</p>;

export const Estimate = ({ route, weather, when, onReset }: any) => {
  const [consumption, setConsumption] = useState<any>(null);

  useEffect(() => {
    getConsumption({ route, weather, when }).then(setConsumption);
  }, []);

  return (
    <Box fill align="center" justify="center">
      <Heading level="3">Estimate Results</Heading>
      <EstimateDetails when={when} route={route} weather={weather} />
      {!consumption ? <Loading /> : <EstimateResult result={consumption} />}
      <Box pad="medium" justify="center" align="center">
        <Button label="Go back" onClick={onReset} />
      </Box>
    </Box>
  );
};
