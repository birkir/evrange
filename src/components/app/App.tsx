import { Line } from '@nivo/line';
import React, { useState } from 'react';
import { calculateRoute } from '../../utils/calculateRoute';

export function App() {
  const [result, setResult] = useState<any>([]);
  const [from, setFrom] = useState('Reykjavik, Iceland');
  const [to, setTo] = useState('Selfoss, Iceland');

  const handleFromChange = (e: any) => setFrom(e.currentTarget.value);
  const handleToChange = (e: any) => setTo(e.currentTarget.value);
  const handleGo = () => {
    setResult(calculateRoute());
  };

  const total = result.reduce((acc: number, item: any) => {
    return acc + item.consumption.totalConsumption;
  }, 0);

  const dataConsumption = result.reduce((acc: any, step: any) => {
    acc.push(...step.consumptionSteps.map(({ consumption, travelDistance }: any) => {
      return { y: Math.round(consumption.subtotalConsumption), x: Math.round(travelDistance) };
    }));
    return acc;
  }, []);

  const dataSpeed = result.reduce((acc: any, step: any) => {
    acc.push(...step.consumptionSteps.map(({ consumption, travelDistance }: any) => {
      return { y: consumption.speedInKmPerHour, x: Math.round(travelDistance) };
    }));
    return acc;
  }, []);

  const dataHeight = result.reduce((acc: any, step: any) => {
    acc.push(...step.consumptionSteps.map(({ rise, travelDistance }: any) => {
      return { y: rise, x: Math.round(travelDistance) };
    }));
    return acc;
  }, []);

  const dataDir = result.reduce((acc: any, step: any) => {
    acc.push(...step.consumptionSteps.map(({ consumption, travelDistance }: any) => {
      return { y: consumption.cardinalDirection, x: Math.round(travelDistance) };
    }));
    return acc;
  }, []);

  const dataWind = result.reduce((acc: any, step: any) => {
    acc.push(...step.consumptionSteps.map(({ consumption, travelDistance }: any) => {
      return { y: consumption.windDirection, x: Math.round(travelDistance) };
    }));
    return acc;
  }, []);

  return (
    <div style={{ margin: 16 }}>
      <Line
        width={1000}
        height={500}
        curve="monotoneX"
        animate={false}
        enableDots={false}
        data={[{
          id: 'consumption',
          data: dataConsumption
        }, {
          id: 'speed',
          data: dataSpeed
        }, {
          id: 'elevation rise',
          data: dataHeight
        }, {
          id: 'driving direction',
          data: dataDir,
        }, {
          id: 'wind direction',
          data: dataWind,
        }]}
        yScale={{
          type: 'linear',
          max: 300,
          min: -100,
        }}
        enableGridX={false}
        enableGridY
      />
      <ul>
        <li>
          From: <input type="text" onChange={handleFromChange} value={from} />
        </li>
        <li>
          To: <input type="text" onChange={handleToChange} value={to} />
        </li>
        <li>
          <button onClick={handleGo}>Go</button>
        </li>
      </ul>
      <div>
        <p>
          <strong>Total: {total.toFixed(0)} W</strong>
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <td>Distance</td>
            <td>Duration</td>
            <td>W/km</td>
            <td>Watts</td>
          </tr>
        </thead>
        {result.map((step: any, i1: number) => {
          return (
            <tbody key={i1}>
              <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                <td>{step.distance.text} m</td>
                <td>{step.duration.text}</td>
                <td>{step.consumption.subtotalConsumption.toFixed(1)} W</td>
                <td>{Math.floor(step.consumption.totalConsumption)} W</td>
              </tr>
              {step.consumptionSteps.map(({ consumption, rise }: any, i2: number) => (
                <tr key={i2}>
                  <td>{Math.round(consumption.distance)} m</td>
                  <td></td>
                  <td></td>
                  <td>{consumption.totalConsumption.toFixed(1)} W</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: 'rgba(0, 0, 128, 0.05)' }}>
                <td>{step.consumptionSteps.reduce((acc: number, { consumption }: any) => acc + consumption.distance, 0).toFixed(1)} m</td>
                <td></td>
                <td></td>
                <td>{step.consumptionSteps.reduce((acc: number, { consumption }: any) => acc + consumption.totalConsumption, 0).toFixed(1)} W</td>
              </tr>
              <tr><td style={{ height: 30 }}>{' '}</td></tr>
          </tbody>
          );
        })}
      </table>
    </div>
  );
}
