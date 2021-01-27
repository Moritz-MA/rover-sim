import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'

let checkpoint = 0;
let target_lat: number, target_lon: number, startpoint_lat: number, startpoint_lon: number;
[startpoint_lat, startpoint_lon, target_lat, target_lon] = [1, 1, 1.000060, 1.000010]

const loop: ControlLoop = ({ location, heading, clock }, { engines }) => {

  let ankathete, gegenkat, arctan, a, b, c;
  a = ((target_lat - startpoint_lat) * 100000);   // länge strecke a
  b = ((target_lon - startpoint_lon) * 100000);   // länge strecke b
  c = (Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))) // länge strecke c
  // katheten definieren
  if (a > b) {
    ankathete = a;
    gegenkat = b;
  } else {
    ankathete = b;
    gegenkat = a;
  }
  // calc tan of tangens
  arctan = (Math.atan2(gegenkat, ankathete) * 180 / Math.PI);
  if (checkpoint > 0) {
    if(a > b) {
      arctan = 360 - arctan;
    } else {
    // calculate tan in rechtwinkligem Dreieck
    arctan = 360 - (90 - arctan);
    }
  }
  if(arctan > 360) {
    arctan -= 360;
  }

  // if running first time
  if (arctan >= 0 && checkpoint == 0) {
    arctan -= 360;
    arctan *= -1;
  } else if (arctan < 0 && checkpoint == 0) {
    arctan += 360;
  }


  let run_forrest, distance_c, distance, distance_lat, distance_lon;
  distance_lat = ((target_lat - location.latitude) * 100000);
  distance_lon = ((target_lon - location.longitude) * 100000);
  distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))
  distance = c;

  console.log('distance:', distance, 'verbleibend:', distance_c, 'heading', heading, 'zu fahrender Winkel:', arctan, 'engine:', engines)

  // define engines
  run_forrest = [0, 0]
  if (heading + 1 !== arctan || heading - 1 !== arctan) {
    // fahrzeug ausrichten
    if (heading < arctan) {
      run_forrest = [0.5, -0.6]
    } else if (heading > arctan) {
      run_forrest = [-0.6, 0.5]
    }
    // wenn heading = arctan ist (ausgerichtet)
    if (heading > arctan - 0.8 && heading < arctan + 0.8 && distance_c > 0.3) {
      if (distance_c > 0 && distance_c > 60) {
        run_forrest = [1, 1]
      }
      if (distance_c < 20) {
        run_forrest = [0.55, 0.55]
      }
    }
    // Ziel erreicht, nächster checkpoint festlegen
    if (distance_c < 0.3) {
      run_forrest = [0, 0]
      checkpoint += 1;
    }
  } else {
    run_forrest = [-0.1, 0.1]
  }
  // point arrived switch to next
  if (checkpoint == 1) {
    startpoint_lat = 1.000060
    startpoint_lon = 1.000010
    target_lat = 1.000090
    target_lon = 1.00007
  }
  if (checkpoint == 2) {
    startpoint_lat = 1.000090
    startpoint_lon = 1.00007
    target_lat = 1.000000
    target_lon = 1.000000
  }

  return {
    engines: run_forrest
  }
}
const simulation = new Simulation({
  loop,
  origin: {
    latitude: startpoint_lat,
    longitude: startpoint_lon,
  },
  element: document.querySelector('main') as HTMLElement,
  locationsOfInterest: [{
    latitude: target_lat,
    longitude: target_lon,
    label: 'A'
  },
  {
    latitude: 1.000090,
    longitude: 1.00007,
    label: 'B'
  },
  ],
  renderingOptions: {
    width: 800,
    height: 800,
  },
  //physicalConstraints: AUTHENTICITY_LEVEL1
});

simulation.start();

