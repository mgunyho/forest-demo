audioPlayer = document.querySelector('#song')

let trees = []
let groundBlobs = []
let cam

let targetZ = 0
let timeToNextTarget = 4

let endTarget

let sinTime = 0
let deltaTime = 0
let treeYoffset = 0

let introFont

const treeSpawnAmount = 10

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

  //if the song ends, end demo
  if (demoTime >= 170) {
    endDemo()
  }

  //Walking
  let yOffset = 0
  if (demoTime > 8 && demoTime < 32) {
    yOffset = sin(demoTime*2) * -30
  }

   cam.linearAdvance(demoTime, yOffset)

  //Every time the camera meets target, move target and spawn trees
  if ( cam.atTarget && !endTarget ) {
    if (  demoTime > 16) {
      timeToNextTarget = 2
    } else if (demoTime > 64) {
      timeToNextTarget = 4
    }
    if ( demoTime > 140) {
      timeToNextTarget = 40
      endTarget = createVector( 0, 0, cam.target.z - 6400)
      //ending
      spotLight(255, 0, 0, endTarget.x, endTarget.y + 2, endTarget.z, 1, 0, 0)

    }

    moveCameraTarget()
    objectAdderDeleter()
  }
  
  //Add lead dissort after 16 beats
  let dissort = 0
  if (demoTime > 16) {
    dissort = (demoTime + 0.2) % 2 / 2
  }

  const defFov = 2 * Math.atan(height / 2 / 800)
  perspective(1, width/height, 10)
  //wonky perspective effect at 32 beats
  if (demoTime > 32 && demoTime < 52 ) {
    sinTime = demoTime - 32
    let pers = 0.7 * (Math.sin((sinTime - 1)/1.3)) + 1.6
    //perspective(4*(Math.sin(sinTime + 1)/10) + 2.3, width/height, 10)
    perspective(pers, width/height, 10)
  }

  //Draw stuff
  background(20, 20, 40); // Sky blue

  if (demoTime < 8 ) {
    drawIntroText()
  }

  if (endTarget) {
    drawEndTarget()
  }

  drawGround()

  //cahnge trunk colour 
  let trunkhue
  if (demoTime > 60) {
    tColor = 20*Math.sin((demoTime/5.6))+20
    trunkHue = createVector(100*Math.sin((demoTime/5.6))+120, 63, 27)
    if (tColor < 0) {
      console.log("trunk hue is " + tColor)
    } else if (tColor >350) {
      console.log("trunk hue is " + tColor)
    }

  } else {
    trunkHue = createVector(26, 63, 27)
  }

  if (demoTime > 90 && demoTime < 120) {
    console.log(demoTime)
    treeYoffset -= (demoTime - 90) * 0.5
  } 
  
  if (demoTime > 110 && treeYoffset < 1) {
    treeYoffset += (demoTime - 90) * 0.5
    console.log(demoTime)
  }

  for (const tree of trees) {
    tree.draw(dissort, trunkHue)
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

  if ( !endTarget ) {
    cam.setTarget(newTarget, lastTargetTime + timeToNextTarget, lastTargetTime)
  } else {
    cam.setTarget(endTarget, lastTargetTime + timeToNextTarget, lastTargetTime)
  }
}

function objectAdderDeleter() {
    //procedurally add trees and blobs
    trees = [ ...trees, ...spawnTrees(targetZ-800)]
    blobs = [ ...blobs, ...spawnBlobs(targetZ-800)]

    //Prune trees that are behind camera Z
    trees = trees.filter( tree => tree.z - 50 < cam.location.z )
    blobs = blobs.filter( blobs => blobs.z - 50 < cam.location.z )
}

function drawEndTarget() {
  push();
  colorMode(HSL)
  fill(0, 0, 100);
  translate(endTarget);
  translate(0, 0, -200);
  cylinder(400, 400)
  pop();
}

function drawIntroText() {
  push();
  textFont(introFont);
  translate(0, -200, 600); // Position the text 200 units above the origin
  rotateX(-HALF_PI); // Correcting the rotation to be flat on the XZ plane without mirroring
  fill(255, 255, 255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Forest for the Trees', 0, 0);
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
    trees.push(new Tree( x, treeYoffset, z))
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