// Discharge efficiency. Rouch guess inspired of https://batteryuniversity.com/learn/article/bu_808c_coulombic_and_energy_efficiency_with_the_battery
export const batteryDischargeConsumption = (consumptionFromRollingResistance: number, consumptionFromWindDrag: number, consumptionFromMotor: number, consumptionFromDCToAcInverter: number, batteryDischargeEfficiency: number = 0.90) => {
  const consumptionFromDragTyresMotorAndInverter = consumptionFromRollingResistance 
    + consumptionFromWindDrag
    + consumptionFromMotor
    + consumptionFromDCToAcInverter;
  const consumptionFromBatteryDischarge = consumptionFromDragTyresMotorAndInverter / batteryDischargeEfficiency - consumptionFromDragTyresMotorAndInverter;
  return consumptionFromBatteryDischarge; // (Wh/km)
}