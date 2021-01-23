import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'

let checkpoint = 0;
let target_lat: number, target_lon: number, startpoint_lat: number, startpoint_lon: number;
[startpoint_lat, startpoint_lon, target_lat, target_lon] = [1, 1, 1.000110, 1.000150]

let location_arr = [{ 'latitude': startpoint_lat, 'longitude': startpoint_lon, 'label': 'Start' }, { 'latitude': target_lat, 'longitude': target_lon, 'label': 'Finsh' },]

// for (let index = 0; index < 3; index++) {
//   let checkpoint_a = 'A' + index;
//   let checkpoint_b = 'B' + index;
//   checkpoint_a.toString()
//   checkpoint_b.toString()
//   location_arr.push(
//     { 'latitude': target_lat, 'longitude': target_lon + (index / 20000), 'label': checkpoint_a },
//     { 'latitude': startpoint_lat, 'longitude': target_lon + (index / 20000), 'label': checkpoint_b })
//   // {'latitude': target_lat, 'longitude': target_lon + ( index /100000), 'label':checkpoint_b}
// }

const loop: ControlLoop = ({ location, heading, clock }, { engines }) => {

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
  // calc tan of tangens
  arctan = (Math.atan2(gegenkat, ankathete) * 180 / Math.PI);
  if (gegenkat == 0 && a == 0) {
    arctan = 90;
  } else if (gegenkat == 0 && b == 0) {
    arctan = 270;
  }
  if (arctan < 0) {
    arctan += 360;
  }


  let run_forrest, distance_c, distance, distance_lat, distance_lon, angle;
  distance_lat = ((target_lat - location.latitude) * 100000);
  distance_lon = ((target_lon - location.longitude) * 100000);
  distance_c = (Math.sqrt(distance_lat ** 2 + distance_lon ** 2))
  distance = c;

  console.log(engines, checkpoint, heading)
  // console.log(distance_lat, a)
  console.log(target_lon, location.longitude, distance_lon, b)

  // define engines
  run_forrest = [0.8, 0.8]
  if(checkpoint == 0) {
    if (heading > 1) {
      run_forrest = [0.85, -0.8]
    }
    if(heading > 359) {
      run_forrest = [-0.8, 0.85]
    }
    if (heading + 1 > 90 && heading - 1 < 90) {
      run_forrest = [0.8, 0.8]
      
    }
  }
  if (checkpoint == 3 && distance_lon - b >= 4) {
    checkpoint = 0
    run_forrest = [0, 0]
  }
  if (distance_lat < 0.5 && checkpoint == 0) {
    run_forrest = [0, 0]
    checkpoint = 1;
  }
  if (checkpoint == 1) {
    if (target_lat > startpoint_lat) {
      if (heading < 90) {
        run_forrest = [0.85, -0.8]
      } else {
        run_forrest = [-0.8, 0.85]
      }
      if (heading + 1 > 90 && heading - 1 < 90) {
        run_forrest = [0.8, 0.8]
        
      }
    }
  }
  if (checkpoint == 1 && distance_lon - b >= 2) {
    checkpoint = 2
    run_forrest = [0, 0]
  }
  if(checkpoint == 2) {
    if (heading < 180) {
      run_forrest = [0.85, -0.8]
    } else {
      run_forrest = [-0.8, 0.85]
    }
    if (heading + 1 > 180 && heading - 1 < 180) {
      run_forrest = [0.8, 0.8]
    }
  }
  if (checkpoint == 2 && distance_lat + 0.5 > a) {
    checkpoint = 3
    run_forrest = [0, 0]
  }
  if(checkpoint == 3) {
    if (heading < 90) {
      run_forrest = [0.85, -0.8]
    } else {
      run_forrest = [-0.8, 0.85]
    }
    if (heading + 1 > 90 && heading - 1 < 90) {
      run_forrest = [0.8, 0.8]
    }
  }
  if (checkpoint == 3 && distance_lon - b >= 4) {
    checkpoint = 0
    run_forrest = [0, 0]
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
    // { latitude: 1.00006, longitude: 1.00006, radius: 0.6 },
  ],
});

simulation.start();

