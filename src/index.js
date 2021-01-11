import { Simulation } from 'rover';

const loop = ({ location, heading, clock }, { engines }) => ({
  engines: [0.5, 0.8],
});

const simulation = new Simulation({
  loop,
  origin: {
    latitude: 52.477050353132384,
    longitude: 13.395281227289209,
  },
  element: document.querySelector('main'),
  locationsOfInterest: [
    {
      latitude: 52.47880703639255,
      longitude: 13.395281227289209,
      label: 'A',
    },
  ],
  renderingOptions: {
    width: 800,
    height: 800,
  },
});

simulation.start();
