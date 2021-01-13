import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'
let checkpoint = false;
let target_lat = 0.00060;
let target_lon = 0.0005;
let startpoint_lat = 0;
let startpoint_lon = 0;
let a = ((target_lat - startpoint_lat) * 100000);
let b = ((target_lon - startpoint_lon) * 100000);
let c = (Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)))
let ankathete;
let gegenkat;
if (a > b) {
  ankathete = a;
  gegenkat = b;
} else {
  ankathete = b;
  gegenkat = a;
}

// calc tan of dreieck
let arctan = (Math.atan2(gegenkat, ankathete) * 180 / Math.PI);
let cos = Math.acos(b / c)
cos = cos * (180 / Math.PI);
if (arctan > 0) {
  arctan -= 360;
  arctan *= -1;
} else {
  arctan += 360;
}


console.log(ankathete, gegenkat, arctan)
const loop: ControlLoop = ({ location, heading, clock }, { engines }) => {
  heading = heading
  let run_forrest;
  let distance_lat = ((target_lat - location.latitude) * 100000);
  let distance_lon = ((target_lon - location.longitude) * 100000);
  let distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))
  let distance = c;


  console.log('distance: ', c, distance_c, distance_lat, distance_lon)
  console.log(engines, heading + 1, heading - 1)

  run_forrest = [0, 0]
  if (heading + 1 !== arctan || heading - 1 !== arctan) {
    if (heading < arctan) {
      run_forrest = [0.5, -0.6]
    } else if (heading > arctan) {
      run_forrest = [-0.6, 0.5]
    }
    if (heading > arctan - 0.5 && heading < arctan + 0.5) {
      if (distance_c > 0 && distance_c > 60) {
        run_forrest = [1, 1]
        // short to point a
      }
      if (distance_c < 60) {
        run_forrest = [0.51, 0.51]
      }
      if (distance_c < 10) {
        run_forrest = [0, 0]
      }
    }
  } else {
    run_forrest = [0, 0]
  }
  if (heading < arctan - 0.5 && heading > arctan + 0.5) {
    if (distance_c > 0) {
      // short to point a
      if (distance < 20) {
        run_forrest = [0.51, 0.51]
      }
      if (distance < 5) {
        run_forrest = [0, 0]
      }
    } else {
      run_forrest = [-0.55, -0.55]
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
  locationsOfInterest: [{
    latitude: target_lat,
    longitude: target_lon,
    label: 'A'
  },
  ],
  renderingOptions: {
    width: 800,
    height: 800,
  },
  // physicalConstraints: AUTHENTICITY_LEVEL1
});

simulation.start();

