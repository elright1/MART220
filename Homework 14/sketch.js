let player;
let obstacles = [];
let triangles = [];
let collectibles = [];
let score = 0;
let bgImg;
let goldStar;
let won = false;
let myFont;

function preload() {
  bgImg = loadImage('background.jpg'); // Upload your background image
  myFont = loadFont('DeliusSwashCaps-Regular.ttf'); // Upload your font file
}

function setup() {
  createCanvas(800, 600, WEBGL);
  player = createVector(0, 0);

  // Create obstacles (3D red cubes)
  for (let i = 0; i < 5; i++) {
    obstacles.push({
      pos: createVector(random(-300, 300), random(-200, 200)),
      speed: createVector(random(1, 2), random(1, 2)),
      size: 30,
      active: true
    });
  }

  // Create chasing triangles
  for (let i = 0; i < 5; i++) {
    triangles.push({
      pos: createVector(random(-300, 300), random(-200, 200)),
      speed: 2,
      size: 30,
      active: true
    });
  }

  // Create collectibles
  for (let i = 0; i < 5; i++) {
    collectibles.push({
      pos: createVector(random(-300, 300), random(-200, 200)),
      size: 20,
      collected: false
    });
  }

  // Create gold star
  goldStar = {
    pos: createVector(random(-300, 300), random(-200, 200)),
    size: 30,
    collected: false
  };
}

function draw() {
  background(200);

  // Draw background image
  push();
  resetMatrix();
  imageMode(CORNER);
  image(bgImg, -width / 2, -height / 2, width, height);
  pop();

  // Lighting
  directionalLight(255, 255, 255, 0, 0, -1);
  ambientLight(100);

  // Player movement
  if (!won) {
    if (keyIsDown(LEFT_ARROW)) player.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) player.x += 5;
    if (keyIsDown(UP_ARROW)) player.y -= 5;
    if (keyIsDown(DOWN_ARROW)) player.y += 5;
  }

  // Draw player
  push();
  translate(player.x, player.y);
  fill(255, 105, 180);
  noStroke();
  ellipse(0, 0, 40, 40);
  pop();

  // Draw and check red 3D cubes
  for (let o of obstacles) {
    if (!o.active) continue;

    o.pos.add(o.speed);
    if (o.pos.x > 350 || o.pos.x < -350) o.speed.x *= -1;
    if (o.pos.y > 250 || o.pos.y < -250) o.speed.y *= -1;

    push();
    translate(o.pos.x, o.pos.y);
    fill(200, 50, 50); // Red color for cubes
    noStroke();
    box(o.size);
    pop();

    let d = dist(player.x, player.y, o.pos.x, o.pos.y);
    if (d < o.size / 2 + 20) {
      o.active = false;
      score = max(score - 1, 0); // Don't go below 0
    }
  }

  // Draw and check chasing triangles
  for (let t of triangles) {
    if (!t.active) continue;

    // Move the triangle towards the player
    let angle = atan2(player.y - t.pos.y, player.x - t.pos.x);
    t.pos.x += cos(angle) * t.speed;
    t.pos.y += sin(angle) * t.speed;

    push();
    translate(t.pos.x, t.pos.y);
    fill(200, 50, 50); // Red color for triangles
    noStroke();
    triangle(
      0, -t.size / 2,
      -t.size / 2, t.size / 2,
      t.size / 2, t.size / 2
    );
    pop();

    let d = dist(player.x, player.y, t.pos.x, t.pos.y);
    if (d < t.size / 2 + 20) {
      t.active = false;
      score = max(score - 1, 0); // Don't go below 0
    }
  }

  // Draw and check collectibles
  for (let c of collectibles) {
    if (c.collected) continue;

    push();
    translate(c.pos.x, c.pos.y);
    fill(255, 255, 0);
    sphere(c.size / 2);
    pop();

    let d = dist(player.x, player.y, c.pos.x, c.pos.y);
    if (d < c.size / 2 + 20) {
      c.collected = true;
      score++;
    }
  }

  // Draw and check gold star
  if (!goldStar.collected) {
    push();
    translate(goldStar.pos.x, goldStar.pos.y);
    fill(255, 215, 0);
    rotateY(frameCount * 0.02);
    rotateX(frameCount * 0.01);
    cone(goldStar.size / 2, goldStar.size);
    pop();

    let d = dist(player.x, player.y, goldStar.pos.x, goldStar.pos.y);
    if (d < goldStar.size / 2 + 20) {
      goldStar.collected = true;
      won = true;
    }
  }

  // Draw score
  push();
  resetMatrix();
  textFont(myFont); // Set font before using text in WEBGL
  fill(0);
  textSize(24);
  textStyle(BOLD);
  text(`Score: ${score}`, 20, 30);
  pop();

  // Win message
  if (won) {
    push();
    resetMatrix();
    textFont(myFont);
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(255); // White text background
    rectMode(CENTER);
    noStroke();
    rect(width / 2 - 400, height / 2 - 100, 400, 100, 20); // Move the box up and left

    fill(0, 150, 0); // Green text
    text("🎉 YOU WIN! 🎉", width / 2 - 400, height / 2 - 100); // Move the text up and left
    pop();
  }
}
