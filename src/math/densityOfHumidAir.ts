const Rd = 287.058; // Specific gas constant for dry air (J/(kg*K))
const Rv = 461.495; // Specific gas constant for water vapor (J/(kg*K))
const Md = 0.028964; // Molar mass of dry air (kg/mol)
const Mv = 0.018016; // Molar mass of water vapor (kg/mol)
const R = 8.31447; // udeal universal gas constant (J/(mol*K))
const L = 0.0065; // Temperature lapse rate (K/m)
const g = 9.80665; // earth-surface gravitational acceleration (m/(s^2)

const pressureWithDeltaHeight = (
  p0: number,
  T0: number,
  M: number,
  h: number
) => {
  const p = p0 * Math.pow(1 - (L * h) / T0, (g * M) / (R * L));
  return p;
};

const temperatureInKelvin = (temperatureInCelcius: number) => {
  return temperatureInCelcius + 273.15;
};

export const densityOfHumidAir = (
  temperatureInCelcius: number,
  relativeHumidity: number,
  absoluteAirPressureInPascal: number,
  heightAboveReference: number
) => {
  // https://en.wikipedia.org/wiki/Density_of_air
  const Tcelsius = temperatureInCelcius;
  const T = temperatureInKelvin(temperatureInCelcius);
  // const psat = 6.1078 * 10^(7.5 * Tcelsius / (Tcelsius + 237.3)) * 100; // Saturation vapor pressure of water (Pa)
  const psat =
    6.1078 * Math.pow(10, (7.5 * Tcelsius) / (Tcelsius + 237.3)) * 100; // Saturation vapor pressure of water (Pa)
  const phi = relativeHumidity / 100; // Get ration instead of %
  const pv = phi * psat; // Vapor pressure of water
  const p = absoluteAirPressureInPascal; // Absolute air pressure (Pa)
  const pd = p - pv; // Partial pressure of dry air (Pa)

  const h = heightAboveReference;
  const pdAtHeight = pressureWithDeltaHeight(pd, T, Md, h);
  const pvAtHeight = pressureWithDeltaHeight(pv, T, Mv, h);
  const densityOfHumidAirAdjustedForHeight =
    pdAtHeight / (Rd * T) + pvAtHeight / (Rv * T);

  return densityOfHumidAirAdjustedForHeight;
};
