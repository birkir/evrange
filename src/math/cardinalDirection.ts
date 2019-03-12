export const cardinalDirection = (a: [number, number], b: [number, number]) => {
  const dLon = (b[1] - a[1]);
  const y = Math.sin(dLon) * Math.cos(b[0]);
  const x = Math.cos(a[0]) * Math.sin(b[0]) - Math.sin(a[0]) * Math.cos(b[0]) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return (brng > 0 ? brng : (2 * Math.PI + brng)) * 360 / (2 * Math.PI);
}
