import type LatLonSpherical from 'geodesy/latlon-spherical'

//
// Calculations assume straight-line travel
//

export enum UnitSpeed {
  'MetersPerSecond' = 'MetersPerSecond',
  'KilometersPerHour' = 'KilometersPerHour',
}

export const getSpeed = (currentLocation: LatLonSpherical, lastLocation: LatLonSpherical, currentClock: number, lastClock: number, unit: UnitSpeed) => {
  const elapsedTimeInSeconds = (currentClock - lastClock) / 1000

  switch (unit) {
    case UnitSpeed.MetersPerSecond:
      return currentLocation.distanceTo(lastLocation) / elapsedTimeInSeconds
    case UnitSpeed.KilometersPerHour:
      return (currentLocation.distanceTo(lastLocation) / elapsedTimeInSeconds) * 3.6
  }
}
