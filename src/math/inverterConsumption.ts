export const inverterConsumption = (
  consumptionFromRollingResistance: number,
  consumptionFromWindDrag: number,
  consumptionFromMotor: number,
  dcToACInverterEfficiency: number = 0.95
) => {
  const consumptionFromDragTyresAndMotor =
    consumptionFromRollingResistance +
    consumptionFromWindDrag +
    consumptionFromMotor;
  const consumptionFromDCToAcInverter =
    consumptionFromDragTyresAndMotor / dcToACInverterEfficiency -
    consumptionFromDragTyresAndMotor;
  return consumptionFromDCToAcInverter; // (Wh/km)
};
