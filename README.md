# evrange
Estimate kW consumption routes for electric vehicles

Based on math from https://evconsumption.firebaseapp.com

### Example output (hardcoded route with weather and elevation data)

#### Route
- From: 63.9359314, -21.0211805
- To: 64.1462404, -21.79177
- Duration: 47 mins
- Distance: 54.6 km

#### Weather
- Wind speed: 2.25m/s
- Wind angle: 64.5026
- Pressure: 991.52kPa
- Temperature: -0.2C


#### Route Legs

| Distance | Duration | Grade | Elevation | Speed     | Direction angle | Average Consumption | Leg Consumption |
| -------- | -------- | ----- | --------- | --------- | --------------- | ------------------- | --------------- |
| 73 m     | 1 min    | 0.01  | 41.56 m   | 20.22 kph | 11.67           | 135.00 W            | 9.86 W          |
| 0.2 km   | 1 min    | 0.01  | 42.77 m   | 18.00 kph | 150.28          | 117.85 W            | 22.39 W         |
| 0.3 km   | 1 min    | 0.03  | 47.29 m   | 15.30 kph | 26.96           | 213.70 W            | 54.49 W         |
| 0.6 km   | 1 min    | -0.01 | 47.09 m   | 42.87 kph | 132.69          | 36.59 W             | 23.53 W         |
| 1.3 km   | 2 mins   | 0.02  | 54.76 m   | 44.26 kph | 167.51          | 182.20 W            | 235.22 W        |
| 0.6 km   | 1 min    | -0.03 | 57.18 m   | 48.69 kph | 195.31          | -42.41 W            | -24.09 W        |
| 1.0 km   | 1 min    | -0.01 | 43.00 m   | 80.92 kph | 223.21          | 115.14 W            | 113.88 W        |
| 0.4 km   | 1 min    | 0.00  | 38.46 m   | 54.62 kph | 344.17          | 115.86 W            | 50.98 W         |
| 2.4 km   | 2 mins   | 0.02  | 59.22 m   | 69.45 kph | 169.55          | 209.22 W            | 512.59 W        |
| 0.8 km   | 1 min    | 0.00  | 81.03 m   | 49.69 kph | 125.24          | 115.58 W            | 97.31 W         |
| 33.3 km  | 24 mins  | -0.00 | 55.74 m   | 82.54 kph | 102.51          | 134.90 W            | 4497.27 W       |
| 12.3 km  | 10 mins  | -0.00 | 16.49 m   | 71.32 kph | 120.82          | 117.17 W            | 1439.25 W       |
| 0.5 km   | 1 min    | 0.00  | 4.84 m    | 33.81 kph | 226.46          | 108.40 W            | 57.02 W         |
| 0.6 km   | 2 mins   | -0.00 | 4.32 m    | 20.88 kph | 269.66          | 62.69 W             | 34.54 W         |
| 0.2 km   | 1 min    | 0.00  | 3.19 m    | 14.97 kph | 342.99          | 88.58 W             | 16.21 W         |

#### Total consumption
7.14 kW
