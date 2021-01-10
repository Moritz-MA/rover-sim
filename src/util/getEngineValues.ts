const ignoreDeadVoltage = (x: number) => {
  if (x <= 0.5 && x >= -0.5) {
    return 0
  } else {
    return x
  }
}

export const getEngineValues = (distanceToLOI: number, speed: number): number[] => {
  console.log('distance to loi: ', distanceToLOI)
  console.log('speed in m/s: ', speed)
  if (distanceToLOI > 30) {
    return [1, 1]
  } else {
    const engineValue = ignoreDeadVoltage(Math.tanh(distanceToLOI - (speed * (speed / 2))))
    return [engineValue, engineValue]
  }
}
