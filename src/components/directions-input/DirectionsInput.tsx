import { differenceInDays, format, formatRelative } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Box, Button, Form, FormField, Heading } from 'grommet';
import { DateTimePicker } from 'material-ui-pickers';
import React, { useState } from 'react';

interface DirectionsInput {
  onSubmit?(e: any): any;
}

export const DirectionsInput = ({ onSubmit }: DirectionsInput) => {
  const [selectedDate, handleDateChange] = useState(new Date());
  const handleSubmit = ({ value }: any) => {
    if (onSubmit) {
      return onSubmit({
        ...value,
        when: selectedDate,
      });
    }
  };
  return (
    <Box fill align="center" justify="center">
      <Heading level="3">Estimate Trip</Heading>
      <Box
        width="medium"
        background="light-1"
        border={{ color: 'brand', size: 'large' }}
        pad="medium"
      >
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Starting point"
            name="origin"
            placeholder="Origin address or coords"
            required
          />
          <FormField
            label="Destination"
            name="destination"
            placeholder="Destination address or coords"
          />
          <FormField label="When" name="destination">
            <Box>
              <DateTimePicker
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
                ampm={false}
                InputProps={{
                  className: 'mui-datepicker',
                }}
                labelFunc={x => {
                  if (x < new Date(Date.now() + 60000)) {
                    return 'Now';
                  }
                  if (differenceInDays(x, Date.now()) < 2) {
                    const res = formatRelative(x, Date.now(), { locale: enGB });
                    return res.substr(0, 1).toLocaleUpperCase() + res.substr(1);
                  }
                  return format(x, 'PPpp', { locale: enGB });
                }}
              />
            </Box>
          </FormField>
          <br />
          <Button primary fill type="submit" label="Estimate" />
        </Form>
      </Box>
    </Box>
  );
};
