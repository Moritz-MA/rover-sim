import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'
let checkpoint = false;
let target_lat = 52.477550353132384;
let target_lon = 13.395311227289209;
let startpoint_lat = 52.477050353132384;
let startpoint_lon = 13.395281227289209;
const distance_lat_compl = (target_lat - startpoint_lat) * 100000;
const distance_lon_compl = (target_lon - startpoint_lon) * 100000;
let c = ~~(Math.sqrt(Math.pow(distance_lat_compl, 2) + Math.pow(distance_lon_compl, 2)))

console.log( distance_lat_compl,distance_lon_compl)

// calc tan of dreieck
let arctan = Math.atan2(distance_lon_compl, distance_lat_compl) * 180 / Math.PI;
if (arctan < 0) {
  arctan = ~~((arctan * -1));
}
  


console.log(distance_lat_compl, distance_lon_compl, arctan)
const loop: ControlLoop = ({ location, heading, clock }, { engines }) => {
  heading = ~~heading
  let run_forrest;
  let distance_lat = ~~((target_lat - location.latitude) * 100000);
  let distance_lon = ~~((target_lon - location.longitude) * 100000);
  let distance = ~~c;


  console.log('distance: ', distance, c, distance_lat, distance_lon)
  console.log(engines, ~~heading + 1, ~~heading - 1)

  run_forrest = [0, 0]
  if (heading + 1 !== arctan || heading - 1 !== arctan) {
    if (heading < arctan) {
      run_forrest = [0.5, -0.5]
    } else {
      run_forrest = [-0.5, 0.5]
    }
    if (heading > arctan - 1 && heading < arctan + 1) {
      run_forrest = [1,1]
    }
  } else {
    run_forrest = [0, 0]
  }
  if (heading < arctan - 0.5 && heading > arctan + 0.5) {
    if (distance > 0) {
      // short to point a
      if (distance < 30) {
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

