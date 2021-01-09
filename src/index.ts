import { ControlLoop, LocationOfInterest, Simulation } from 'rover'
import { getSpeed, UnitSpeed } from './util/getSpeed'
import LatLon from 'geodesy/latlon-spherical.js'
import LatLonSpherical from 'geodesy/latlon-spherical'
import { getEngineValues } from './util/getEngineValues'
import { getHarmonicMean } from './util/getHarmonicMean'

const LOIs: LocationOfInterest[] = [
  {
    latitude: 52.47880703639255,
    longitude: 13.395281227289209,
    label: 'A'
  }
]

interface PriorMetrics {
  location: LatLonSpherical | null
  heading: number | null
  clock: number | null
  speeds: number[]
}

const priorMetrics: PriorMetrics = {
  location: null,
  heading: null,
  clock: null,
  speeds: [],
}

const updateMetrics = (location: LatLonSpherical, heading: number, clock: number) => {
  priorMetrics.location = location
  priorMetrics.heading = heading
  priorMetrics.clock = clock
}

const updateSpeedMetrics = (currentSpeed: number) => {
  if (priorMetrics.speeds.length > 10) {
    priorMetrics.speeds.shift()
  }
  priorMetrics.speeds.push(currentSpeed)
}

const loop: ControlLoop = ({location, heading, clock}, {engines}) => {

  const currentLocation = new LatLon(location.latitude, location.longitude)
  const loiLocation = new LatLon(LOIs[0].latitude, LOIs[0].longitude)

  const distanceToLoi = currentLocation.distanceTo(loiLocation)

  if (priorMetrics.location && priorMetrics.clock) {
    const speed = getSpeed(currentLocation, priorMetrics.location, clock, priorMetrics.clock, UnitSpeed.MetersPerSecond)
    updateSpeedMetrics(speed)
    updateMetrics(currentLocation, heading, clock)
    const harmonicMeanSpeed = getHarmonicMean(priorMetrics.speeds)
    return {
      engines: getEngineValues(distanceToLoi, harmonicMeanSpeed)
    }
  } else {
    updateMetrics(currentLocation, heading, clock)
    return {
      engines: [0, 0]
    }
  }
}

const simulation = new Simulation({
  loop,
  origin: {
    latitude:52.477050353132384,
    longitude:13.395281227289209
  },
  element: document.querySelector('main') as HTMLElement,
  locationsOfInterest: [
    ...LOIs
  ],
  renderingOptions: {
    width: 800,
    height: 800,
  }
});

simulation.start();
