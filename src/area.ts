import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'

let checkpoint = 0;
let target_lat: number, target_lon: number, startpoint_lat: number, startpoint_lon: number;
[startpoint_lat, startpoint_lon, target_lat, target_lon] = [1, 1, 1.000060, 1.000060]

let ankathete, gegenkat, arctan, a:number, b:number, c:number;
a = ((target_lat - startpoint_lat) * 100000);   // länge strecke a
b = ((target_lon - startpoint_lon) * 100000);   // länge strecke b
c = (Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))) // länge strecke c


const loop: ControlLoop = ({ location, heading, clock }, { engines }) => {

  let run_forrest, distance_c, distance, distance_lat, distance_lon;
  distance_lat = ((target_lat - location.latitude) * 100000);
  distance_lon = ((target_lon - location.longitude) * 100000);
  distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))
  distance = c;
  let radius = b - 1;

  console.log(checkpoint, heading)

  // define engines
  run_forrest = [0, 0]
  if (distance_lat > 0.6 && checkpoint == 0) {
    run_forrest = [0.6, 0.6]
  } else {
    run_forrest = [0, 0]
    if (heading < 270) {
      run_forrest = [0.5, -0.6]
    } else if (heading > 270) {
      run_forrest = [-0.6, 0.5]
    }
    if(heading > 270 - 0.8 && heading < 270 + 0.8 && checkpoint < 3) {
      checkpoint = 1
      if(distance_lon <= -1 && checkpoint == 1) {
        checkpoint = 2
      } else if (checkpoint == 1) {
        run_forrest = [0.55,0.55]
      }
    }
    if (heading < 180 && checkpoint == 2) {
      run_forrest = [0.5, -0.6]
    } else if (heading > 180 && checkpoint == 2) {
      run_forrest = [-0.6, 0.5]
    }
    if(heading > 180 - 0.8 && heading < 180 + 0.8 && checkpoint > 1) {
      checkpoint = 3
      if(distance_lat >= 0.6 && checkpoint == 3) {
        checkpoint = 4
        run_forrest = [0,0]
      } else if (checkpoint == 3) {
        run_forrest = [0.55,0.55]
      }
    }
    if (heading < 270 && checkpoint == 4) {
      run_forrest = [0.5, -0.6]
    } else if (heading > 270 && checkpoint == 4) {
      run_forrest = [-0.6, 0.5]
    }
    if(heading > 270 - 0.8 && heading < 270 + 0.8 && checkpoint > 3) {
      checkpoint = 5
      if(distance_lon <= -2 && checkpoint == 5) {
        checkpoint = 6
        run_forrest = [0,0]
      } else if (checkpoint == 5) {
        run_forrest = [0.55,0.55]
      }
    }
    if (heading < 359.2 && checkpoint == 6) {
      run_forrest = [0.5, -0.59]
    } else if (heading > 0.9 && checkpoint == 6) {
      run_forrest = [-0.59, 0.5]
    }
    if(heading >= 359.1 && heading < 0.8 && checkpoint == 6) {
      checkpoint = 0
      run_forrest = [0,0]
    }
  }

  // point arrived switch to next
  if (checkpoint == 1) {
    startpoint_lat = 1.000060
    startpoint_lon = 1.000060
    target_lat = 1.00000
    target_lon = 1.00000
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
  //physicalConstraints: AUTHENTICITY_LEVEL1
});

simulation.start();

