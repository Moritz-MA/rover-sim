import { Simulation } from 'rover';

const locationsOfInterest = [
  {
    latitude: 52.477050353132384,
    longitude: 13.395281227289209,
    label: 'Origin',
  },
  {
    latitude: 52.47880703639255,
    longitude: 13.395281227289209,
    label: 'A',
  },
  {
    latitude: 52.477160453132384,
    longitude: 13.395492227289209,
    label: 'B',
  },
];

const calcRouteHeading = targetLocation => {
  const a = targetLocation.latitude - locationsOfInterest[0].latitude;
  const b = targetLocation.longitude - locationsOfInterest[0].longitude;

  let heading = (Math.atan2(a, b) * 180) / Math.PI;
  if (heading < 0) {
    heading *= -1;
  }

  console.log(Math.round(heading));
  return heading;
};

const loop = ({ location, heading, clock }, { engines }) => {
  const targetHeading = calcRouteHeading(locationsOfInterest[2]);
  console.log(Math.round(heading));

  if (Math.round(heading) !== Math.round(targetHeading)) {
    return {
      engines: [0.3, -0.3],
    };
  }

  return {
    engines: [1.0, 1.0],
  };
};

const simulation = new Simulation({
  loop,
  origin: locationsOfInterest[0],
  element: document.querySelector('main'),
  locationsOfInterest,
  renderingOptions: {
    width: 800,
    height: 800,
  },
});

simulation.start();
