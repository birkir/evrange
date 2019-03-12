import { types } from 'mobx-state-tree';
import { batteryDischargeConsumption } from '../math/batteryDischargeConsumption';
import { densityOfHumidAir } from '../math/densityOfHumidAir';
import { heaterConsumption } from '../math/heaterConsumption';
import { inclineConsumption } from '../math/inclineConsumption';
import { inverterConsumption } from '../math/inverterConsumption';
import { motorConsumption } from '../math/motorConsumption';
import { motorEfficiency } from '../math/motorEfficiency';
import { rollingResistanceConsumption } from '../math/rollingResistanceConsumption';
import { windDragConsumption } from '../math/windDragConsumption';

export const Consumption = types.model('Consumption', {
  // driving parameters
  speedInKmPerHour: 90,
  inclineInPercent: 0,
  heaterAcPower: 0,
  cardinalDirection: 0,
  
  // weather
  temperatureInCelcius: 15,
  relativeHumidity: 80,
  absoluteAirPressureInPascal: 101325,
  heightAboveReference: 0,
  windSpeed: 0,
  windDirection: 0,
  
  // car paramteres
  massOfCarInKg: 1700,
  dragCoefficient: 0.29,
  rollingCoefficient: 0.0125,
  dragReferenceAreaInSquareMeters: 2.511,

  // assumed constants
  dcToACInverterEfficiency: 0.95,
  batteryDischargeEfficiency: 0.90,
  motorEfficiencyAtMax: 0.96,
  motorEfficiencyAtMin: 0.85,
  speedInKmPerHourAtMaxMotorEfficiency: 90,

  // unused
  distance: 0,
})
.views((self) => ({
  get speedInMsec() {
    return self.speedInKmPerHour * 1000 / 3600;
  },
  get airDensity() {
    return densityOfHumidAir(self.temperatureInCelcius, self.relativeHumidity, self.absoluteAirPressureInPascal, self.heightAboveReference);
  },
  get motorEfficiency() {
    return motorEfficiency(self.motorEfficiencyAtMax, self.motorEfficiencyAtMin, self.speedInKmPerHourAtMaxMotorEfficiency, self.speedInKmPerHour);
  },
  get rollingResistanceConsumption() {
    return rollingResistanceConsumption(self.rollingCoefficient);
  },
  get windDragConsumption() {
    const angle = (self.cardinalDirection - self.windDirection) % 360;
    const x = Math.cos(Math.PI * 2 * angle / 360);
    const angleWindSpeed = x * self.windSpeed;
    const adjustedSpeed = (self as any).speedInMsec - angleWindSpeed;
    return windDragConsumption(self.dragCoefficient, self.dragReferenceAreaInSquareMeters, (self as any).airDensity, adjustedSpeed);
  },
  get motorConsumption() {
    return motorConsumption((self as any).rollingResistanceConsumption, (self as any).windDragConsumption, (self as any).motorEfficiency);
  },
  get inverterConsumption() {
    return inverterConsumption((self as any).rollingResistanceConsumption, (self as any).windDragConsumption, (self as any).motorConsumption, self.dcToACInverterEfficiency);
  },
  get batteryDischarge() {
    return batteryDischargeConsumption((self as any).rollingResistanceConsumption, (self as any).windDragConsumption, (self as any).motorConsumption, (self as any).inverterConsumption, self.batteryDischargeEfficiency);
  },
  get inclineConsumption() {
    return inclineConsumption(self.inclineInPercent, self.massOfCarInKg);
  },
  get heaterConsumption() {
    return heaterConsumption(self.heaterAcPower, (self as any).speedInMsec);
  },
  get subtotalConsumption() {
    return (
      (self as any).rollingResistanceConsumption +
      (self as any).windDragConsumption +
      (self as any).motorConsumption +
      (self as any).inverterConsumption +
      (self as any).batteryDischarge +
      (self as any).inclineConsumption +
      (self as any).heaterConsumption
    );
  },
  get totalConsumption() {
    return (self as any).subtotalConsumption * self.distance / 1000;
  }
}));