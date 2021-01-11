import { ControlLoop, Simulation } from 'rover'

const loop: ControlLoop = ({location, heading, clock}, {engines}) => {
  if(Math.round(heading) <= 90){
    console.log(Math.round(heading));
    
    return {
      engines: [0.6,-0.6]
    }
  } else if(clock < 40000){
    console.log(Math.round(heading));
    
    return {
      engines: [1.0,1.0]
    }
  } else if(clock < 45000){
    return {
      engines: [-1.0,-1.0]
    }
  } else {
    return {
      engines: [0,0]
    }
  }
}
const simulation = new Simulation({
  loop,
  origin: {
    latitude:52.477050353132384,
    longitude:13.395281227289209
  },
  element: document.querySelector('main') as HTMLElement,
  locationsOfInterest: [{
    latitude: 52.47880703639255,
    longitude: 13.395281227289209,
    label: 'A'
  }],
  renderingOptions: {
    width: 800,
    height: 800,
  }
});



simulation.start();
