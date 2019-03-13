import { Box } from 'grommet';
import React from 'react';

export const EstimateDetails = ({ when, route, weather }: any) => {
  const leg = route.direction.routes[0].legs[0];

  return (
    <Box width="large" background="light-1" pad="medium">
      <h3>
        From: {leg.start_address}
        <br />
        To: {leg.end_address}
      </h3>
      <p>
        Distance: {leg.distance.text}
        <br />
        Duration: {leg.duration.text}
      </p>
    </Box>
  );
};
