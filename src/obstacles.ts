import { LatLon } from 'geodesy/utm';
import { ControlLoop, Simulation, AUTHENTICITY_LEVEL2, Engines, Steering, VehicleType } from 'rover'

let checkpoint = 0;
let no_obstacles = true;
let rotate_now: boolean = false
let target_lat: number,target_lon: number,startpoint_lat: number,startpoint_lon: number;
let higher_lower = false;
[startpoint_lat, startpoint_lon, target_lat, target_lon] = [1.00004, 1, 1.0002, 1.00002]

let location_arr = [{ 'latitude': startpoint_lat, 'longitude': startpoint_lon, 'label': 'Origin' }, { 'latitude': target_lat, 'longitude': target_lon, 'label': 'Finish' }]


console.log(location_arr)

const loop: ControlLoop = ({ location, heading, clock, proximity, targetFinderSignal }, { engines, steering }) => {


  let ankathete, gegenkat, arctan: any, a, b, c, stop, min_speed, speed: any, turn_left: any, turn_right, backwards, backwards_min, max_speed;
  a = ((target_lat - startpoint_lat) * 100000);   // länge strecke a
  b = ((target_lon - startpoint_lon) * 100000);   // länge strecke b
  c = (Math.sqrt(a ** 2 + b ** 2)) // länge strecke c
  // katheten definieren


  ankathete = 0;
  gegenkat = 0;
  if (a >= b && checkpoint == 0) {
    ankathete = a;
    gegenkat = b;
  }
  if (a < b && checkpoint == 0) {
    ankathete = b;
    gegenkat = a;
  }

  // calc tan of tangens
  arctan = (Math.atan2(gegenkat, ankathete) * 180 / Math.PI);
  if (arctan < 0) {
    arctan *= -1;
  }
  if (checkpoint == 0 && startpoint_lon > target_lon) {  // if startpoint is left
    if (arctan >= 0 && checkpoint == 0) {
      arctan -= 360;
      arctan *= -1;
    } else if (arctan < 0 && checkpoint == 0) {
      arctan += 360;
    }
  }


  let run_forrest, distance_c, distance, distance_lat, distance_lon, distance_lat_area, distance_lat_area_live;
  distance_lat = ((target_lat - location.latitude) * 100000);
  distance_lon = ((target_lon - location.longitude) * 100000);
  distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))



  // define engine
  stop = [0, 0];
  min_speed = [0.53, 0.53];
  speed = [0.84, 0.84]
  max_speed = [1, 1]
  turn_left = [0.84, -0.84]
  turn_right = [-0.84, 0.84]
  backwards = [-0.84, -0.84]
  backwards_min = [-0.53, -0.53]



  run_forrest = stop
  if (no_obstacles) {
    if (heading > arctan) {
      run_forrest = turn_left
    }
    if (heading < arctan) {
      run_forrest = turn_right
    }
    if (arctan < 5 || arctan > 355) {
      if (heading < 20) {
        run_forrest = [0.84, -0.84]
      }
      if (heading > 340) {
        run_forrest = [-0.84, 0.84]
      }
    }
    if (heading > arctan - 0.3 && heading < arctan + 0.3 && distance_c > 0.3) {
      if (distance_c > 60) {
        run_forrest = max_speed
      } else if (distance_c <= 60) {
        run_forrest = speed
      }
      if (distance_c < 10) { // default 10
        run_forrest = min_speed
      }
    }
    if (distance_c <= 0.1 && run_forrest == stop && checkpoint !== 404) {
      run_forrest = stop
      checkpoint += 1
    }
    if (distance_c <= 0.3) {
      run_forrest = min_speed
    }
  }
  if (proximity[0] < 3 && proximity[0] !== -1) {
    no_obstacles = false
    run_forrest = stop
    setTimeout(function () {
      rotate_now = true
    }, 1600)
  }
  if (rotate_now) {
    if (proximity[1] < proximity[178]) {
      run_forrest = turn_left
      if (proximity[10] > 3 && proximity[1] > 3) {
        run_forrest = speed
        rotate_now = false
      }
    } else {
      run_forrest = turn_right
      if (proximity[169] > 3 && proximity[179] > 3) {
        run_forrest = speed
        rotate_now = false
      }
    }
  }
  if (!no_obstacles && proximity[0] >= 3 && !rotate_now) {
    run_forrest = speed
    const isBelowThreshold = (currentValue: number) => currentValue >= 2;
    if (proximity.every(isBelowThreshold)) {
      run_forrest = stop
      setTimeout(function () {
        startpoint_lat = location.latitude;
        startpoint_lon = location.longitude;
      }, 1900)
      setTimeout(function () {
        no_obstacles = true
      }, 2000)
    }
  }


  console.log(proximity[0], heading, arctan, proximity[15])


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
  vehicleType: VehicleType.Tank,
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
  // physicalConstraints: AUTHENTICITY_LEVEL2,
  obstacles: [
    { latitude: 1.0001, longitude: 1.0000, radius: 1.3 },
  ],
});

simulation.start();

