const g = 9.80665; // earth-surface gravitational acceleration (m/(s^2)
const m = 1700; // Vehicle weight (kg)

export const rollingResistanceForce = (rollingCoefficient: number) => {
  // rolling resistance coefficient, chose value in the middle of "Ordinary car tires on concrete interval of .01 to 015"
  const Cr = rollingCoefficient;
  const Fr = Cr * m * g;
  return Fr;
};
