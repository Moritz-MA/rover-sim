import { LatLon } from 'geodesy/utm';
import { ControlLoop, Simulation, AUTHENTICITY_LEVEL2, RoverType, Engines, Steering } from 'rover'

let checkpoint = 0;
let start_higher = false;
let search_radius = 1;  // wie nah soll der bereich gecheckt werden
let counter = search_radius;
let target_lat: number;
let target_lon: number;
let target_b_lat: number;
let target_b_lon: number;
let startpoint_lat: number;
let startpoint_lon: number;
let higher_lower = false;
[startpoint_lat, startpoint_lon, target_lat, target_lon, target_b_lat, target_b_lon] = [1.00004, 1, 1.00005, 1.00006, 1.0002, 1.0002]

let location_arr = [{ 'latitude': startpoint_lat, 'longitude': startpoint_lon, 'label': 'Origin' }, { 'latitude': target_lat, 'longitude': target_lon, 'label': 'Start' }]

location_arr.push({ 'latitude': target_b_lat, 'longitude': target_b_lon, 'label': 'finsh' })

console.log(location_arr)

const loop: ControlLoop = ({ location, heading, clock, proximity, targetFinderSignal }, { engines, steering }) => {


  if (checkpoint == 1) {
    startpoint_lat = 1.00005;
    startpoint_lon = 1.00006;
    target_lat = 1.0002;
    target_lon = 1.0002;
  }
  if (checkpoint == 404) {
    startpoint_lat = location.latitude;
    startpoint_lon = location.longitude;
    target_lat = location_arr[0].latitude;
    target_lon = location_arr[0].longitude;
  }

  if (startpoint_lat < target_lat) {
    start_higher = true
  }


  let ankathete, gegenkat, arctan, a, b, c, stop, min_speed, speed, turn_left, turn_right, backwards, backwards_min, max_speed;
  a = ((target_lat - startpoint_lat) * 100000);   // länge strecke a
  b = ((target_lon - startpoint_lon) * 100000);   // länge strecke b
  c = (Math.sqrt(a ** 2 + b ** 2)) // länge strecke c
  // katheten definieren
  if(checkpoint == 0 && startpoint_lon > target_lon) {  // if startpoint is left
    if (a < 0) a *= -1;
    if (b < 0) b *= -1;
  }

  ankathete = 0;
  gegenkat = 0;
  if (a <= b && checkpoint == 0) {
    ankathete = a;
    gegenkat = b;
  }
  if (a > b && checkpoint == 0) {
    ankathete = b;
    gegenkat = a;
  }

  // calc tan of tangens
  arctan = (Math.atan2(gegenkat, ankathete) * 180 / Math.PI);
  if (arctan < 0) {
    arctan *= -1;
  }
  if(checkpoint == 0 && startpoint_lon > target_lon) {  // if startpoint is left
    if (arctan >= 0 && checkpoint == 0) {
      arctan -= 360;
      arctan *= -1;
    } else if (arctan < 0 && checkpoint == 0) {
      arctan += 360;
    }
  }

  console.log(arctan, gegenkat, ankathete)


  let run_forrest, distance_c, distance, distance_lat, distance_lon, distance_lat_area, distance_lat_area_live;
  distance_lat = ((target_lat - location.latitude) * 100000);
  distance_lon = ((target_lon - location.longitude) * 100000);
  if(!start_higher) {
    distance_lat_area = ((target_lat - target_b_lat) * 100000);
    distance_lat_area_live = ((location.latitude - target_b_lat) * 100000)
  } else {
    distance_lat_area = ((target_b_lat - startpoint_lat) * 100000);
    distance_lat_area_live = ((target_b_lat - location.latitude) * 100000)
  }
  if (distance_lat_area < 0) {
    distance_lat_area *= -1;
  }
  if (distance_lat_area_live < 0) {
    distance_lat_area_live *= -1;
  }
  distance_c = (Math.sqrt(Math.pow(distance_lat, 2) + Math.pow(distance_lon, 2)))
  distance = c;
  if (!start_higher) {
    if (checkpoint == 1) {
      arctan = 90
      distance_c = distance_lon
    }
    if (checkpoint == 2) {
      arctan = 180
      distance_c = 1
      if (distance_lat_area_live < distance_lat_area - counter) {
        distance_c = 0
        counter += search_radius
      }
    }
    if (checkpoint == 3) {
      arctan = 270
      distance_c = ((location.longitude - target_lon) * 100000) + b;
    }
    if (checkpoint == 4) {
      arctan = 180
      distance_c = 1
      if (distance_lat_area_live < distance_lat_area - counter) {
        distance_c = 0
        counter += search_radius
      }
    }
    if (checkpoint == 5) {
      checkpoint = 1
    }
    if (distance_c <= 0.1) {
      checkpoint += 1
    }
    if (counter >= distance_lat_area) {
      checkpoint = 404
    }
  } else {
    if (checkpoint == 1) {
      arctan = 90
      distance_c = distance_lon
      if(target_lon < startpoint_lon) {
        arctan = 270
        distance_c = distance_lon * -1;
      }
    }
    if (checkpoint == 2) {
      arctan = 0
      distance_c = 1
      if (distance_lat_area_live < distance_lat_area - counter) {
        distance_c = 0
        counter += search_radius
      }
    }
    if (checkpoint == 3) {
      arctan = 270
      distance_c = ((location.longitude - target_lon) * 100000) + b;
      if(target_lon < startpoint_lon) {
        arctan = 90
        distance_c = (b + ((location.longitude - target_lon) * 100000)) * -1;
      }
    }
    if (checkpoint == 4) {
      arctan = 0
      distance_c = 1
      if (distance_lat_area_live < distance_lat_area - counter) {
        distance_c = 0
        counter += search_radius
      }
    }
    if (checkpoint == 5) {
      checkpoint = 1
    }
    if (distance_c <= 0.1) {
      checkpoint += 1
    }

  }


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
  if (checkpoint == 404 && distance_c < 1) {
    run_forrest = stop
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
  // physicalConstraints: AUTHENTICITY_LEVEL2,
  obstacles: [
    // { latitude: 1.00004, longitude: 1.000015, radius: 0.6 },
  ],
});

simulation.start();

