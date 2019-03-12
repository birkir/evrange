import { rollingResistanceForce } from './rollingResistanceForce';

const s = 1000; // displacement distance (m)
const joulesPerWattHour = 3600; // (J/Wh)

export const rollingResistanceConsumption = (
  rollingResistanceCoefficient: number
) => {
  const Fr = rollingResistanceForce(rollingResistanceCoefficient);
  const W = Fr * s; // Work done (J)
  const workInWattHours = W / joulesPerWattHour; // (Wh)
  return workInWattHours;
};
