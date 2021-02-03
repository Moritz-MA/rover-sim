import { Simulation } from 'rover';

// ZIELPUNKTE

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

const startTarget = locationsOfInterest[2];

// ZIEL AUSRICHTUNG BESTIMMEN

const calcRouteHeading = (target, origin) => {
  const a = target.latitude - origin.latitude;
  const b = target.longitude - origin.longitude;
  const c = Math.sqrt(a ** 2 + b ** 2);

  let angle = (Math.atan2(b, a) * 180) / Math.PI;

  if (angle < 0) {
    angle = 360 + angle;
  }

  return { a, b, c, angle };
};

// ROVER LOOP

const loop = ({ location, heading, clock }, { engines }) => {
  const target = startTarget;
  const route = calcRouteHeading(target, location);

  // NAV INFOS

  console.table([
    `Ziel Punkt: ${target.label}`,
    `Aktuelle Ausrichtung: ${Math.round(heading)}`,
    `Ziel Ausrichtung: ${Math.round(route.angle)}`,
    `Ziel Entfernung: ${Math.round(route.c * 1000000000) / 100}`,
  ]);

  // DREHRICHTUNG BESTIMMEN

  const angleDiff = (angle2, angle1) => {
    let targetAngle = angle2 - angle1;
    targetAngle -= targetAngle > 180 ? 360 : 0;
    targetAngle += targetAngle < -180 ? 360 : 0;
    return targetAngle;
  };

  // KURS KORRIGIERUNG

  if (
    Math.round(heading) !== Math.round(calcRouteHeading(target, location).angle)
  ) {
    if (angleDiff(calcRouteHeading(target, location).angle, heading) >= 0) {
      return {
        engines: [-0.85, 0.85],
      };
    }
    return {
      engines: [0.85, -0.85],
    };
  }

  // VOLLES ROHR

  return {
    engines: [0.85, 0.85],
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
