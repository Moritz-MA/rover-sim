import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'

let checkpoint = 0;
let target_lat: number, target_lon: number, startpoint_lat: number, startpoint_lon: number;
[startpoint_lat, startpoint_lon, target_lat, target_lon] = [1, 1, 1.000060, 1.000010]

const loop: ControlLoop = ({ location, heading, clock }, { engines }) => {

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


  // calc tan of tangens
  let arctan = (Math.atan2(gegenkat, ankathete) * 180 / Math.PI);

  if (arctan >= 0) {
    arctan -= 360;
    arctan *= -1;
  } else {
    arctan += 360;
  }
  if (checkpoint == 1) {
    arctan = 316
  }

  heading = heading
  let run_forrest;
  let distance_lat = ((target_lat - location.latitude) * 100000);
  let distance_lon = ((target_lon - location.longitude) * 100000);
  let distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))
  let distance = c;

  console.log('distance:', distance, 'verbleibend:', distance_c, heading, arctan)

  run_forrest = [0, 0]
  if (heading + 1 !== arctan || heading - 1 !== arctan) {
    if (heading < arctan) {
      run_forrest = [0.5, -0.6]
    } else if (heading > arctan) {
      run_forrest = [-0.6, 0.5]
    }
    if (heading > arctan - 0.8 && heading < arctan + 0.8) {
      if (distance_c > 0 && distance_c > 60) {
        run_forrest = [1, 1]
        // short to point a
      }
      if (distance_c < 20) {
        run_forrest = [0.55, 0.55]
      }
      if (distance_c < 0.3) {
        if (heading < 360) {
          run_forrest = [0.5, -0.6]
        } else if (heading > 360) {
          run_forrest = [-0.6, 0.5]
        }
      }
      if (distance < 0.3 && heading == 360) {
        run_forrest = [0, 0]
        checkpoint += 1;
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
      if (distance < 0.3) {
        run_forrest = [0, 0]
      }
    } else {
      run_forrest = [-0.55, -0.55]
    }
  }
  console.log(checkpoint)
  if (checkpoint == 1) {
    startpoint_lat = 1.000060
    startpoint_lon = 1.000010
    target_lat = 1.000090
    target_lon = 1.000070
  } else if (checkpoint == 2) {
    startpoint_lat = 1.000090
    startpoint_lon = 1.000070
    target_lat = 1
    target_lon = 1
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
    longitude: 1.000070,
    label: 'B'
  },
  ],
  renderingOptions: {
    width: 800,
    height: 800,
  },
  // physicalConstraints: AUTHENTICITY_LEVEL1
});

simulation.start();

