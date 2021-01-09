export const getEngineValues = (distanceToLOI: number, speed: number): number[] => {
  if (distanceToLOI < 0.26) {
    // to prevent on location drift
    return [0,0]
  } else {
    return [Math.tanh(distanceToLOI - (speed * 1.24)), Math.tanh(distanceToLOI - (speed * 1.24))]
  }
}
