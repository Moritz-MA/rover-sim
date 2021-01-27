import { LatLon } from 'geodesy/utm';
import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1, RoverType, Engines, Steering } from 'rover'

let checkpoint = 0;
let target_lat: number;
let target_lon: number;
let target_b_lat: number;
let target_b_lon: number;
let startpoint_lat: number;
let startpoint_lon: number;
[startpoint_lat, startpoint_lon, target_lat, target_lon, target_b_lat, target_b_lon] = [1.000110, 0.99995, 1.0003, 1.00002, 0.99994, 1.00006]

let location_arr = [{ 'latitude': startpoint_lat, 'longitude': startpoint_lon, 'label': 'Start' }, { 'latitude': target_lat, 'longitude': target_lon, 'label': '' },]

for (let index = 0; index < 3; index++) {
  let checkpoint_a = 'A' + index;
  let checkpoint_b = 'B' + index;
  checkpoint_a.toString()
  checkpoint_b.toString()
  location_arr.push(
    { 'latitude': target_lat, 'longitude': target_lon + (index / 20000), 'label': checkpoint_a },
    { 'latitude': target_b_lat, 'longitude': target_b_lon + (index / 20000), 'label': checkpoint_b })
}

console.log(location_arr)

const loop: ControlLoop = ({ location, heading, clock, proximity, targetFinderSignal }, { engines, steering }) => {

  for (let i = 0; i < location_arr.length -1; i++) {
    if(checkpoint == i) {
      let e = 1 +i;
      startpoint_lat = location_arr[i].latitude;
      startpoint_lon = location_arr[i].longitude;
      target_lat = location_arr[e].latitude;
      target_lon = location_arr[e].longitude;
    }
  }

  let ankathete, gegenkat, arctan, a, b, c, stop, min_speed, speed, turn_left, turn_right, backwards, backwards_min, max_speed;
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
    if(arctan < 0) {
      arctan *=-1;
    }

    let run_forrest, distance_c, distance, distance_lat, distance_lon;
    distance_lat = ((target_lat - location.latitude) * 100000);
    distance_lon = ((target_lon - location.longitude) * 100000);
    distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))
    distance = c;

    // define engine
    stop = [0, 0];
    min_speed = [0.53, 0.53];
    speed = [0.84, 0.84]
    max_speed = [1, 1]
    turn_left = [0.84, -0.84]
    turn_right = [-0.84, 0.84]
    backwards = [-0.84, -0.84]
    backwards_min = [-0.53, -0.53]

    console.log(arctan, heading, checkpoint)
    console.log(distance_c)

    run_forrest = stop
    if (heading > arctan) {
      run_forrest = turn_left
    }
    if (heading < arctan) {
      run_forrest = turn_right
    }
    if (heading > arctan - 0.3 && heading < arctan + 0.3 && distance_c > 0.3) {
      if (distance_c > 60) {
        run_forrest = max_speed
      } else if (distance_c <= 60) {
        run_forrest = speed
      }
      if (distance_c < 15) {
        run_forrest = min_speed
      }
    } else if (distance_c <= 0.1) {
      run_forrest = stop
      if(checkpoint == 0) {
        checkpoint = 1
      } else if (checkpoint == 1) {
        checkpoint = 2
      } else if (checkpoint == 2) {
        checkpoint = 3
      }
    }
  const e: Engines = [
    run_forrest[0], run_forrest[1],
    run_forrest[0], run_forrest[1],
    run_forrest[0], run_forrest[1]
  ]
  const s: Steering = [0, 0, 0, 0]
  return {
    engines: e,
    steering: s
  }
}
const simulation = new Simulation({
  loop,
  roverType: RoverType.tank,
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
    // { latitude: 1.00004, longitude: 1.000015, radius: 0.6 },
  ],
});

simulation.start();

