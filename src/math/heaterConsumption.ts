const joulesPerWattHour = 3600; // (J/Wh)

export const heaterConsumption = (
  heaterAcPower: number,
  speedInMperSecond: number
) => {
  const secondsForOneKm = 1000 / speedInMperSecond; // (s)
  const joulesForOneKm = heaterAcPower * secondsForOneKm; // (J/km)
  const consumption = joulesForOneKm / joulesPerWattHour; // (Wh/km);
  return consumption;
};
