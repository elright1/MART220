let shapes = [];
let positions = [];
let rotationSpeeds = [];
let customModel;

function preload() {
  // Load your custom 3D model
  customModel = loadModel('tinker.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

 
  shapes.push('model');

  for (let i = 1; i < 5; i++) {
    shapes.push(random(['box', 'cone', 'cylinder', 'sphere', 'torus']));
  }

  
  for (let i = 0; i < 5; i++) {
    positions.push(createVector(random(-200, 200), random(-200, 200), random(-200, 200)));
    rotationSpeeds.push(random(0.005, 0.03));
  }
}

function draw() {
  background(20);
  orbitControl();


  ambientLight(150); 
  directionalLight(255, 255, 255, 0, 0, -1); 

  for (let i = 0; i < shapes.length; i++) {
    push();
    translate(positions[i].x, positions[i].y, positions[i].z);
    rotateY(frameCount * rotationSpeeds[i]);
    rotateX(frameCount * rotationSpeeds[i]);

    if (shapes[i] === 'model') {
     
      ambientMaterial(255, 195, 206);
      scale(1.5); 
      model(customModel);
    } else {
      normalMaterial(); // Rainbow shading for the extra shapes
      switch (shapes[i]) {
        case 'box':
          box(80);
          break;
        case 'cone':
          cone(40, 100);
          break;
        case 'cylinder':
          cylinder(40, 100);
          break;
        case 'sphere':
          sphere(50);
          break;
        case 'torus':
          torus(40, 15);
          break;
      }
    }
    pop();
  }
}

function mousePressed() {
  // Move 2 shapes to random new locations
  for (let i = 0; i < 2; i++) {
    let index = floor(random(shapes.length));
    positions[index] = createVector(random(-200, 200), random(-200, 200), random(-200, 200));
  }
}
