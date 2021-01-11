import { ControlLoop, Simulation, AUTHENTICITY_LEVEL1 } from 'rover'

const loop: ControlLoop = ({location, heading, clock}, {engines}) => {

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
  },
  physicalConstraints: AUTHENTICITY_LEVEL1
});



simulation.start();
