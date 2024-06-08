audioPlayer = document.querySelector('#song')

let trees = []

let speed = 2;
let angle = 0;
let radius = 500;
let cam

let targetZ = 0

const treeSpawnAmount = 30

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  trees = [ ...spawnTrees(targetZ), ...spawnTrees(targetZ - 800) ]

  cam = new Camera()
  cam.setTarget( createVector(0, 0, targetZ), 8, 0)

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
  translate(0, 100, targetZ);
  rotateX(HALF_PI);
  plane(4000, 10000);
  pop();

  cam.linearAdvance(demoTime)

  //Every time the camera meets target, move target and spawn trees
  if ( cam.atTarget ) {
    const lastTargetTime = cam.targetTime
    
    const x = ( 0.5 - Math.random() ) * 1000 
    targetZ = targetZ - 800
    const newTarget = createVector( x, 0, cam.target.z - 800 )

    // 4 beats to next target untill 16 beats, 2 after that
    const timeToNextTarget = demoTime > 16 ? 2 : 4;

    cam.setTarget(newTarget, lastTargetTime + timeToNextTarget, lastTargetTime)

    //procedurally add trees
    trees = [ ...trees, ...spawnTrees(targetZ-800)]

    //Prune trees that are behind camera Z
    trees = trees.filter( tree => tree.z - 50 <   cam.location.z )
  }
  

  //Add lead dissort after 16 beats
  const dissort = demoTime > 16 ? (demoTime + 0.2) % 2 / 2 : 0

  for (const tree of trees) {
    tree.draw( dissort )
  }
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