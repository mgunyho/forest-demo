

class Camera {
  constructor() {
    this.location = createVector(0, 50, 800)
    
    this.direction = createVector(0, 0, -10)

    this.cameraTilt = createVector(0, -20, 0)
    
    //Origin and target for linear movement
    this.origin = this.location.copy()
    this.originTime = 0
    this.prevDirection = this.direction.copy()
    this.target = this.location.copy()
    this.targetTime = 0
    this.targetDirection = this.direction.copy()

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

      //Map location between origin and target
      const x = map(time, this.originTime, this.targetTime, this.origin.x, this.target.x, true)
      const y = map(time, this.originTime, this.targetTime, this.origin.y, this.target.y, true)
      const z = map(time, this.originTime, this.targetTime, this.origin.z, this.target.z, true)

      //Set updated location
      this.location = createVector(x, y, z)

      //Next map direction bewtween the two
      const dx = map(time, this.originTime, this.targetTime, this.prevDirection.x, this.targetDirection.x)
      const dy = map(time, this.originTime, this.targetTime, this.prevDirection.y, this.targetDirection.y)
      const dz = map(time, this.originTime, this.targetTime, this.prevDirection.z, this.targetDirection.z)

      this.direction = createVector(dx, dy, dz)

      this.#setcamera()
    }
  }

  setTarget(target, targetTime, currentTime) {
    this.origin = this.location.copy()
    this.originTime = currentTime

    this.target = target
    this.targetTime = targetTime

    this.targetDirection = createVector(
      target.x - this.origin.x,
      target.y - this.origin.y,
      target.z - this.origin.z
    )

    this.prevDirection = this.direction.copy()
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
      this.location.x + this.direction.x + this.cameraTilt.x,
      this.location.y + this.direction.y + this.cameraTilt.y,
      this.location.z + this.direction.z + this.cameraTilt.z,
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