
class Tree {
  constructor(x, y, z = 0) {
    //Topc to later to figure the scaling
    this.height = 400;
    this.vec = createVector(x, y, z)

    this.x = x;
    this.y = y;
    this.z = z;

    //create trunk lines
    this.trunkLines = []
    for (let i = 0; i < 1; i++) {
      this.trunkLines.push( new TrunkLine(this) )
    }

    //create leaves
    this.leaves = []
    for (let i = 0; i < 40; i++) {
      this.leaves.push( new Leaf(this) )
    }
  }

  //Remember that these needs 
  draw(dissort = 0, trunkHue) {
    for (const trunkLine of this.trunkLines ) {
      trunkLine.draw(trunkHue)
    }

    //Leaves
    for (const leaf of this.leaves ) {
      leaf.draw(dissort)
    }
  }
} 

const trunkLineWitdh = 10
const colorVar = 20 //eq. 20 means + or - 10

class TrunkLine {
  constructor(parent, maxdist=30 ) {
    this.hue = 270 
    this.sat = 70 
    this.light = 50 + ( 0.5 - Math.random() ) * colorVar
    
    let xoff = ( 0.5 - Math.random() ) * maxdist;
    let zoff = ( 0.5 - Math.random() ) * maxdist;

    this.offset = createVector(xoff, 0, zoff)
    this.trunkThickness = Math.floor(Math.random() * 40) + 20

    this.parent = parent;
  }
  
  draw(trunkHue) {

    push()
    colorMode(HSL)

    //noStroke()
    //fill(this.hue, this.sat, this.light)
    fill(trunkHue.x, trunkHue.y, trunkHue.z)

    const trunkVec =  this.parent.vec.copy();
    trunkVec.add(this.offset)
    translate(trunkVec);

    let axis = createVector(1, 0, 0);
    rotate(PI, axis)
    cone(this.trunkThickness, this.parent.height);
    pop();

  }
}

class Leaf {
  constructor(parent, maxdist=200) {
    this.hue = random(130, 150)
    this.sat = 70 
    this.light = 50 + ( 0.5 - Math.random() ) * colorVar
    
    let xoff = ( 0.5 - Math.random() ) * maxdist;
    let yoff = ( 0.5 - Math.random() ) * maxdist;
    let zoff = ( 0.5 - Math.random() ) * maxdist;

    this.offset = createVector(xoff, yoff, zoff)

    this.parent = parent;
  }

  draw(dissort) {
    push();
    colorMode(HSL);
    //noStroke();
    fill(this.hue, this.sat, this.light);

    const leafVec = this.parent.vec.copy();
    const offsetCopy  =this.offset.copy()
    scaleVector(offsetCopy, 1 + dissort / 5 )

    leafVec.add(offsetCopy);
    translate(leafVec);
    translate(0, -this.parent.height/2, 0);

    sphere(30);
    pop();
  }
}

function scaleVector(v, scale) {
  v.x = v.x * scale
  v.y = v.y * scale
  v.z = v.z * scale
}