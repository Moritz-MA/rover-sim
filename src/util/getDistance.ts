import LatLon from 'geodesy/latlon-ellipsoidal-vincenty'
import {Location} from 'rover'

export const getDistance = (pointA: Location, pointB: Location) => {
  const p1 = new LatLon(pointA.latitude, pointA.longitude)
  const p2 = new LatLon(pointB.latitude, pointB.longitude)
  return p1.distanceTo(p2)
}
