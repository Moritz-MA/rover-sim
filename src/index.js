import { Simulation } from 'rover';

const locationsOfInterest = [
  {
    latitude: 52.477050353132384,
    longitude: 13.395281227289209,
    label: 'Origin',
  },
  {
    latitude: 52.477160453132384,
    longitude: 13.395292227289209,
    label: 'A',
  },
  {
    latitude: 52.477160453132384,
    longitude: 13.395492227289209,
    label: 'B',
  },
];

// ZIEL AUSRICHTUNG BESTIMMEN

const calcRouteHeading = (target, origin) => {
  const a = target.latitude - origin.latitude;
  const b = target.longitude - origin.longitude;
  const c = Math.sqrt(a ** 2 + b ** 2);

  const gegenkat = a > b ? b : a;
  const ankat = a > b ? a : b;

  console.log(gegenkat);

  const arctan = (Math.atan2(gegenkat, ankat) * 180) / Math.PI;
  let angle = 360 - arctan;
  if (angle < 0) {
    angle *= -1;
  }
  return { a, b, c, angle };
};

// ROVER LOOP

const loop = ({ location, heading, clock }, { engines }) => {
  const target = locationsOfInterest[2];
  const start = locationsOfInterest[0];
  const route = calcRouteHeading(target, start);

  console.table([
    `Ziel Punkt: ${target.label}`,
    `Aktuelle Ausrichtung: ${Math.round(heading)}`,
    `Ziel Ausrichtung: ${route.angle}`,
    `Ziel Entfernung: ${Math.round(
      calcRouteHeading(target, start).c * 1000000000
    ) / 100}`,
  ]);

  if (Math.round(heading) !== Math.round(route.angle)) {
    return {
      engines: [0, 0],
    };
  }

  return {
    engines: [1.0, 1.0],
  };
};

// SIMULATION

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
