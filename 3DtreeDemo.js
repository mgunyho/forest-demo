audioPlayer = document.querySelector('#song')

let trees = []
let groundBlobs = []
let cam

let targetZ = 0
let timeToNextTarget = 4

let introFont

const treeSpawnAmount = 30

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  
  trees = [ ...spawnTrees(targetZ), ...spawnTrees(targetZ - 800) ]
  blobs = [ ...spawnBlobs(targetZ), ...spawnBlobs(targetZ - 800) ]

  cam = new Camera()
  cam.setTarget( createVector(0, 0, targetZ), 16, 0)

  introFont = loadFont('./lib/bloodcrow.ttf');

  noStroke();
  noLoop()
}

function draw() {
  ambientLight(128, 100, 100);
  directionalLight(128, 100, 100, 0, 0.5, -0.5);

  const bpm = 138
  const demoTime = getTime() * bpm / 60 + 0.25

  let yOffset = 0
  if (demoTime > 8 && demoTime < 32) {
    yOffset = sin(demoTime*2) * -30
  }

   cam.linearAdvance(demoTime, yOffset)

  //Every time the camera meets target, move target and spawn trees
  if ( cam.atTarget ) {
    if (  demoTime > 16 ) {
      timeToNextTarget = 2
    }

    moveCameraTarget()
    objectAdderDeleter()
  }

  //Add lead dissort after 16 beats
  let dissort = 0
  if (demoTime > 16) {
    dissort = (demoTime + 0.2) % 2 / 2
  }

  //wonky perspective effect at 32 beats
  if (demoTime > 32) {
    perspective(Math.sin(demoTime % 1.5), 1.5, 100)
  }

  //Draw stuff
  background(20, 20, 40); // Sky blue

  drawIntroText()

  drawGround()

  for (const tree of trees) {
    tree.draw( dissort )
  }
  for (const blob of blobs) {
    blob.draw()
  }
}

function moveCameraTarget() {
  const lastTargetTime = cam.targetTime
    
  const x = ( 0.5 - Math.random() ) * 1000 
  targetZ = targetZ - 800
  const newTarget = createVector( x, 0, cam.target.z - 800 )

  cam.setTarget(newTarget, lastTargetTime + timeToNextTarget, lastTargetTime)
}

function objectAdderDeleter() {
    //procedurally add trees and blobs
    trees = [ ...trees, ...spawnTrees(targetZ-800)]
    blobs = [ ...blobs, ...spawnBlobs(targetZ-800)]

    //Prune trees that are behind camera Z
    trees = trees.filter( tree => tree.z - 50 < cam.location.z )
    blobs = blobs.filter( blobs => blobs.z - 50 < cam.location.z )
}

function drawIntroText() {
  push();
  textFont(introFont);
  translate(0, -200, 600); // Position the text 200 units above the origin
  rotateX(-HALF_PI); // Correcting the rotation to be flat on the XZ plane without mirroring
  fill(255, 255, 255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Forrest Friends', 0, 0);
  pop();
}

function drawGround() {
  // Ground
  push();
  fill(34, 139, 34); // Forest green
  translate(0, 100, targetZ);
  rotateX(HALF_PI);
  plane(4000, 10000);
  pop();
}

function spawnTrees( z_origin ) {
  let trees = []
  for (let i = 0; i < treeSpawnAmount; i++) {
    let x = random(-2000, 2000);
    let z = z_origin - random(0, 1600);
    trees.push(new Tree( x, 0, z))
  }
  return trees
}

function spawnBlobs( z_origin ) {
  let blobs = []
  for (let i = 0; i < treeSpawnAmount; i++) {
    let x = random(-2000, 2000);
    let z = z_origin - random(0, 1600);
    blobs.push(new GroundBlob( x, 0, z))
  }
  return blobs
}