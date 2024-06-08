

class Camera {
  constructor() {
    this.location = createVector(0, 50, 800)
    this.direction = createVector(0, 0, -10)

    this.origin = this.location.copy()
    this.originTime = 0
    this.target = this.location.copy()
    this.targetTime = 0

    this.atTarget = true

    this.#setcamera()
  }

  moveForward() {
    this.location.add(this.direction)
    this.#setcamera()
  }

  linearAdvance(time) {
    this.atTarget = locationMatches(this.location, this.target)

    if( !this.atTarget ) {
      const x = map(time, this.originTime, this.targetTime, this.origin.x, this.target.x)
      const y = map(time, this.originTime, this.targetTime, this.origin.y, this.target.y)
      const z = map(time, this.originTime, this.targetTime, this.origin.z, this.target.z)
      camera( x, y, z, this.target.x, this.target.y, this.target.z, 0, 1, 0)
      this.location = createVector(x, y, z)
    }
  }

  setTarget(target, targetTime, currentTime) {
    this.origin = this.location.copy()
    this.originTime = currentTime

    this.target = target
    this.targetTime = targetTime
  }

  turn(angle) {
    const dirX = this.direction.x * cos(angle) - this.direction.z * sin(angle);
    const dirZ = this.direction.x * sin(angle) + this.direction.z * cos(angle);

    this.direction.x = dirX;
    this.direction.z = dirZ;
    this.#setcamera()
  }

  #setcamera() {
    camera(
      this.location.x,
      this.location.y,
      this.location.z,
      this.location.x + this.direction.x,
      this.location.y + this.direction.y,
      this.location.z + this.direction.z,
      0,
      1,
      0
    )
  }
}


function locationMatches(a, b, tolerance = 10) {
  return (
    Math.abs( a.x - b.x ) <= tolerance &&
    Math.abs( a.y - b.y ) <= tolerance &&
    Math.abs( a.z - b.z ) <= tolerance
  ) 
}