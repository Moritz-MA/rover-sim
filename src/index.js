import { Simulation } from 'rover';

const locationsOfInterest = [
  {
    latitude: 52.47880703639255,
    longitude: 13.395281227289209,
    label: 'A',
  },
  {
    latitude: 52.47870703639255,
    longitude: 13.395281227289209,
    label: 'B',
  },
];

const loop = ({ location, heading, clock }, { engines }) => {
  if (clock < 3000) {
    return {
      engines: [0.0, 0.0],
    };
  }
  return {
    engines: [1.0, 1.0],
  };
};

const simulation = new Simulation({
  loop,
  origin: {
    latitude: 52.477050353132384,
    longitude: 13.395281227289209,
  },
  element: document.querySelector('main'),
  locationsOfInterest,
  renderingOptions: {
    width: 800,
    height: 800,
  },
});

simulation.start();
