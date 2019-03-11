export const motorEfficiency = (motorEfficiencyAtMax: number, motorEfficiencyAtMin: number, speedInKmPerHourAtMaxMotorEfficiency: number, speedInKmPerHour: number) => {
  // Rough approximate symmetric parabolic model for motor efficiency over the range of rpms/speed
  // Going from lowest 85% to highest 96% efficiency. Highest at 90 km/h
  const efficiencyAtMax = motorEfficiencyAtMax;
  const efficiencyAtMin = motorEfficiencyAtMin;
  const speedInKmPerHourAtMaxEfficiency = speedInKmPerHourAtMaxMotorEfficiency;

  const factor = efficiencyAtMax - efficiencyAtMin;
  const motorEfficiency = -1 * factor * Math.pow(speedInKmPerHour/speedInKmPerHourAtMaxEfficiency-1, 2) + efficiencyAtMax;
  //return -0.11(x/90-1)^2+.96
  return motorEfficiency;
}
