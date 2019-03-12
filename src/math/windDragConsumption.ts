import { dragForce } from './dragForce';

const s = 1000; // displacement distance (m)
const joulesPerWattHour = 3600; // (J/Wh)

export const windDragConsumption = (
  dragCoefficient: number,
  dragReferenceAreaInSquareMeters: number,
  densityOfHumidAir: number,
  speedInMperSecond: number
) => {
  const Fd = dragForce(
    dragCoefficient,
    dragReferenceAreaInSquareMeters,
    densityOfHumidAir,
    speedInMperSecond
  ); // (N)
  const W = Fd * s; // Work done (J)
  const workInWattHours = W / joulesPerWattHour; // (Wh)
  return workInWattHours;
};
