export const motorConsumption = (consumptionFromRollingResistance: number, consumptionFromWindDrag: number, motorEfficiency: number) => {
  const consumptionFromDragAndTyres = consumptionFromRollingResistance + consumptionFromWindDrag;
  const consumptionFromMotor = consumptionFromDragAndTyres / motorEfficiency - consumptionFromDragAndTyres;
  return consumptionFromMotor; // (Wh/km)
}