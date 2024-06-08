
class GroundBlob {
  constructor(x, y, z, ground = 100) {
    this.hue = 160 
    this.sat = 70 
    this.light = 50 + ( 0.5 - Math.random() ) * colorVar

    this.ground = ground

    this.rX = random(200, 400);
    this.rY = random(10, 50);
    this.rZ = random(200, 400);

    this.vec = createVector(x, y, z)

    this.x = x;
    this.y = y;
    this.z = z;
  }

  draw() {
    push()
    colorMode(HSL)

    noStroke()
    fill(this.hue, this.sat, this.light)

    translate(this.vec);
    translate(0, this.ground, 0)

    ellipsoid(this.rX, this.rY, this.rZ)
    pop()
  }
} 