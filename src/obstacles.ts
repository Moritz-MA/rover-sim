import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'

let checkpoint = 0;
let target_lat: number, target_lon: number, startpoint_lat: number, startpoint_lon: number;
[startpoint_lat, startpoint_lon, target_lat, target_lon] = [1, 1, 1.000110, 0.99995]

let location_arr = [{ 'latitude': startpoint_lat, 'longitude': startpoint_lon, 'label': 'Start' }, { 'latitude': target_lat, 'longitude': target_lon, 'label': 'Finsh' },]

const loop: ControlLoop = ({ location, heading, clock, proximity }, { engines }) => {

  let ankathete, gegenkat, arctan, a, b, c;
  a = ((target_lat - startpoint_lat) * 100000);   // länge strecke a
  b = ((target_lon - startpoint_lon) * 100000);   // länge strecke b
  c = (Math.sqrt(a ** 2 + b ** 2)) // länge strecke c
  // katheten definieren
  if (a > b) {
    ankathete = a;
    gegenkat = b;
  } else {
    ankathete = b;
    gegenkat = a;
  }


  let run_forrest, distance_c, distance, distance_lat, distance_lon, live_ank, live_geg;
  distance_lat = ((target_lat - location.latitude) * 100000);
  distance_lon = ((target_lon - location.longitude) * 100000);
  distance_c = (Math.sqrt(distance_lat ** 2 + distance_lon ** 2))
  distance = c;
  let aas = 1

  if(distance_lat > distance_lon) {
    live_ank = distance_lat
    live_geg = distance_lon
  } else {
    live_ank = distance_lon
    live_geg = distance_lat
  }

  // calc tan of tangens
  arctan = (Math.atan2(live_geg, live_ank) * 180 / Math.PI);
  // if running first time
  if (arctan >= 0 && checkpoint == 0) {
    arctan -= 360;
    arctan *= -1;
  } else if (arctan < 0 && checkpoint == 0) {
    arctan += 360;
  }

console.log(arctan, engines)

  // define engines
  run_forrest = [0.8, 0.8]
  for (let i = 0; i < proximity.length; i++) {
    if (i <= 11) {
      if (proximity[i] <= 2 && proximity[i] !== -1) {
        run_forrest = [-0.9, 0.8]
        aas = 2
      }
      if (proximity[15] !== -1) {
        aas = 2
        run_forrest = [0.8, 0.8]
      }
    }
    else {
      if (checkpoint == 0 && aas == 1 && proximity[i] > 2) {
        if (heading < arctan) {
          run_forrest = [0.85, -0.8]
        } else {
          run_forrest = [-0.8, 0.85]
        }
        if (heading + 1 > arctan && heading - 1 < arctan) {
          run_forrest = [0.8, 0.8]
        }
      }
    }
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
  locationsOfInterest: location_arr,
  renderingOptions: {
    width: 800,
    height: 800,
  },
  //physicalConstraints: AUTHENTICITY_LEVEL1
  obstacles: [
    { latitude: 1.00004, longitude: 1.000014, radius: 0.6 },
  ],
});

simulation.start();

