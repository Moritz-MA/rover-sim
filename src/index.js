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
  {
    latitude: 52.476900453132384,
    longitude: 13.395402227289209,
    label: 'C',
  },
];

let n = 1;
let target;

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
  target = locationsOfInterest[n];
  const route = calcRouteHeading(target, location);

  // NAV INFOS

  console.table([
    `Ziel Punkt: ${n}; ${target.label}`,
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

  if (Math.round(heading) !== Math.round(route.angle)) {
    if (angleDiff(route.angle, heading) >= 0) {
      return {
        engines: [-0.85, 0.85],
      };
    }
    return {
      engines: [0.85, -0.85],
    };
  }

  // VOLLES ROHR
  if (route.c * 10000000 > 400)
    return {
      engines: [0.7, 0.7],
    };

  // NEXT TARGET
  if (route.c * 10000000 < 50) {
    if (n < locationsOfInterest.length - 1) {
      n += 1;
    } else {
      n = 0;
    }
  }

  return {
    engines: [0.6, 0.6],
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
