const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;

export const getWeather = async (res: any) => {
  const leg = res.routes[0].legs[0];
  const points = [leg.steps[0].start_location];

  let total = 0;
  leg.steps.forEach((step: any) => {
    total += step.distance.value;
    if (total > 50000) {
      points.push(step.end_location);
      total = 0;
    }
  });

  if (total > 25000) {
    points.push(leg.steps[leg.steps.length - 1].end_location);
  }

  return Promise.all(
    points.map(async point => {
      const geopoint = [point.lat(), point.lng()];
      const weather = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${
          geopoint[0]
        }&lon=${geopoint[1]}&appid=${apiKey}`
      ).then(r => r.json());
      return { geopoint, weather };
    })
  );
};
