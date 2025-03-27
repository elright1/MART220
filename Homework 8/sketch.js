let player;
let obstacles = [];
let collectibles = [];
let badItems = [];
let score = 0;
let health = 100;
let idleImg, walkImg, badImg, goodImg;

function preload() {
  // Load images for the player, bad items, and good items
  idleImg = loadImage('path_to_your_idle_image.png'); // Replace with your idle image path
  walkImg = loadImage('path_to_your_walk_image.png'); // Replace with your walking image path
  badImg = loadImage('path_to_your_bad_item_image.png'); // Replace with your bad item image path
  goodImg = loadImage('path_to_your_good_item_image.png'); // Replace with your good item image path
}

function setup() {
  createCanvas(400, 400);
  player = new Player(width / 2, height / 2);
  
  // Create 3 random obstacles
  for (let i = 0; i < 3; i++) {
    obstacles.push(new Obstacle(random(width), random(height)));
  }
  
  // Create initial collectible items
  for (let i = 0; i < 5; i++) {
    collectibles.push(new Collectible(random(width), random(height)));
  }
  
  // Create initial bad items
  for (let i = 0; i < 3; i++) {
    badItems.push(new BadItem(random(width), random(height)));
  }
}

function draw() {
  background(220);
  
  // Display player
  player.update();
  player.display();
  
  // Display obstacles
  for (let obs of obstacles) {
    obs.display();
  }
  
  // Display collectibles
  for (let item of collectibles) {
    item.display();
  }
  
  // Display bad items
  for (let item of badItems) {
    item.display();
  }
  
  // Check for collisions
  checkCollisions();
  
  // Display score and health
  fill(0);
  textSize(16);
  text("Score: " + score, 10, 20);
  text("Health: " + health, 10, 40);
  
  // Win or lose conditions
  if (score >= 10) {
    text("You Win!", width / 2 - 40, height / 2);
    noLoop(); // Stop the game
  } else if (health <= 0) {
    text("You Lose!", width / 2 - 40, height / 2);
    noLoop(); // Stop the game
  }
}

function keyPressed() {
  // Start moving in the direction of the key press
  if (keyCode === LEFT_ARROW || key === 'a') {
    player.isMovingLeft = true;
  } else if (keyCode === RIGHT_ARROW || key === 'd') {
    player.isMovingRight = true;
  } else if (keyCode === UP_ARROW || key === 'w') {
    player.isMovingUp = true;
  } else if (keyCode === DOWN_ARROW || key === 's') {
    player.isMovingDown = true;
  }
}

function keyReleased() {
  // Stop moving when the key is released
  if (keyCode === LEFT_ARROW || key === 'a') {
    player.isMovingLeft = false;
  } else if (keyCode === RIGHT_ARROW || key === 'd') {
    player.isMovingRight = false;
  } else if (keyCode === UP_ARROW || key === 'w') {
    player.isMovingUp = false;
  } else if (keyCode === DOWN_ARROW || key === 's') {
    player.isMovingDown = false;
  }
}

function checkCollisions() {
  // Check for collisions with collectibles
  for (let i = collectibles.length - 1; i >= 0; i--) {
    if (player.collidesWith(collectibles[i])) {
      score++;
      collectibles.splice(i, 1);
      // Add a new collectible after one is collected
      collectibles.push(new Collectible(random(width), random(height)));
    }
  }

  // Check for collisions with bad items
  for (let i = badItems.length - 1; i >= 0; i--) {
    if (player.collidesWith(badItems[i])) {
      health -= 10;
      badItems.splice(i, 1);
      // Add a new bad item after one is collected
      badItems.push(new BadItem(random(width), random(height)));
    }
  }
  
  // Check for collisions with obstacles
  for (let obs of obstacles) {
    if (player.collidesWith(obs)) {
      player.undoMove();
    }
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;  // Increased size from 20 to 40
    this.speed = 2;
    this.prevX = x;
    this.prevY = y;
    this.isWalking = false;

    // Flags to track key states
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
  }
  
  update() {
    // Move the player based on key states (held down keys)
    if (this.isMovingLeft) {
      this.x -= this.speed;
      this.isWalking = true;
    }
    if (this.isMovingRight) {
      this.x += this.speed;
      this.isWalking = true;
    }
    if (this.isMovingUp) {
      this.y -= this.speed;
      this.isWalking = true;
    }
    if (this.isMovingDown) {
      this.y += this.speed;
      this.isWalking = true;
    }

    // Keep player within bounds
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }
  
  display() {
    if (this.isWalking) {
      image(walkImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else {
      image(idleImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }
  
  collidesWith(obj) {
    let d = dist(this.x, this.y, obj.x, obj.y);
    return d < this.size / 2 + obj.size / 2;
  }

  undoMove() {
    this.x = this.prevX;
    this.y = this.prevY;
    this.isWalking = false;
  }
}

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
  }
  
  display() {
    fill(0);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
  }
  
  display() {
    image(goodImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}

class BadItem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
  }
  
  display() {
    image(badImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}
