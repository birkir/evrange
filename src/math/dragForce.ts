export const dragForce = (dragCoefficient: number, dragReferenceAreaInSquareMeters: number, densityOfHumidAir: number, speedInMperSecond: number) => {
  // https://en.wikipedia.org/wiki/Drag_coefficient
  const cd = dragCoefficient;
  const A = dragReferenceAreaInSquareMeters;
  const Fd = 0.5 * cd * densityOfHumidAir * Math.pow(speedInMperSecond, 2) * A; 
  return Fd;
}