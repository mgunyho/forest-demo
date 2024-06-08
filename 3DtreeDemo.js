audioPlayer = document.querySelector('#song')

let trees = [];

let speed = 2;
let angle = 0;
let radius = 500;
let cam

let targetIndex = 0
let targets

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < 100; i++) {
    let x = random(-2000, 2000);
    let z = random(-2000, 2000);
    trees.push(new Tree( x, 0, z))
  }

  targets = [
    createVector(0, 0, 0),
    createVector(400, 0, 0),
    createVector(400, 0, 800),
    createVector(0, 0, 800),
  ]

  cam = new Camera()
  cam.setTarget(targets[targetIndex], 4, 0)

  noLoop()
}

function draw() {
  const bpm = 138
  const demoTime = getTime() * bpm / 60 + 0.25

  background(20, 20, 40); // Sky blue
  noStroke();
  
  // Ground
  push();
  fill(34, 139, 34); // Forest green
  translate(0, 100, 0);
  rotateX(HALF_PI);
  plane(4000, 10000);
  pop();

  cam.linearAdvance(demoTime)

  if ( cam.atTarget ) {
    const lastTargetTime = cam.targetTime
    targetIndex++
    targetIndex = targetIndex % targets.length
    cam.setTarget(targets[targetIndex], lastTargetTime + 4, lastTargetTime)

    console.log(getTime())
    console.log(demoTime)
  }
  

  //Add lead dissort after 16 beats
  const dissort = demoTime > 16 ? (demoTime + 0.2) % 2 / 2 : 0


  for (const tree of trees) {
    tree.draw( dissort )
  }
}
