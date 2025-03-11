let myCharacter;
let animations = [];
let bobaImage, tidepodImage;
let bobaX, bobaY, tidepodX, tidepodY;
const bobaSize = 50;
const moveSpeed = 2;
let keys = {}; 

let score = 0;
let gameTime = 5; // ⏳ Timer now starts at 5 seconds
let gameOver = false;
let lastTime = 0;

let bgMusic, goodFoodSound, badFoodSound; // Audio variables

function preload() {
    for (let i = 1; i <= 9; i++) {
        animations.push(loadImage(`Idle${i}.png`));
    }
    bobaImage = loadImage('boba.png');
    tidepodImage = loadImage('tidepod.png');

    // Load sounds
    bgMusic = loadSound('background_music.mp3'); 
    goodFoodSound = loadSound('good_food.mp3');  
    badFoodSound = loadSound('bad_food.mp3');  
}

class Character {
    constructor(name, health, speed, animations) {
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.animations = animations;
        this.currentAnimation = 0;
        this.x = 20;
        this.y = 10;
        this.scaleFactor = 3;
    }

    updateAnimation() {
        this.currentAnimation = (this.currentAnimation + 1) % this.animations.length;
    }

    move() {
        let imgWidth = this.animations[this.currentAnimation].width * this.scaleFactor;
        let imgHeight = this.animations[this.currentAnimation].height * this.scaleFactor;

        if (keys['w']) this.y -= this.speed;
        if (keys['s']) this.y += this.speed;
        if (keys['a']) this.x -= this.speed;
        if (keys['d']) this.x += this.speed;

        this.x = constrain(this.x, 0, width - imgWidth);
        this.y = constrain(this.y, 0, height - imgHeight + 20);
    }

    display() {
        let imgWidth = this.animations[this.currentAnimation].width * this.scaleFactor;
        let imgHeight = this.animations[this.currentAnimation].height * this.scaleFactor;
        image(this.animations[this.currentAnimation], this.x, this.y, imgWidth, imgHeight);
    }
}

function setup() {
    createCanvas(500, 400);
    myCharacter = new Character('Hero', 100, moveSpeed, animations);
    bobaX = random(width - bobaSize);
    bobaY = random(height - bobaSize);
    tidepodX = random(width - bobaSize);
    tidepodY = random(height - bobaSize);
    lastTime = millis();

    // Start background music
    if (!bgMusic.isPlaying()) {
        bgMusic.loop();
    }
}

let frameCounter = 0;
const frameInterval = 10;

function draw() {
    background(220);

    if (!gameOver) {
        let currentTime = millis();
        if (currentTime - lastTime >= 1000) { 
            gameTime--;
            lastTime = currentTime;
            if (gameTime <= 0) {
                gameOver = true;
            }
        }

        frameCounter++;
        if (frameCounter >= frameInterval) {
            myCharacter.updateAnimation();
            frameCounter = 0;
        }

        myCharacter.move();
        myCharacter.display();
        
        // Draw boba and tidepod
        image(bobaImage, bobaX, bobaY, bobaSize, bobaSize);
        image(tidepodImage, tidepodX, tidepodY, bobaSize, bobaSize); 

        let charSize = {
            width: myCharacter.animations[myCharacter.currentAnimation].width * myCharacter.scaleFactor,
            height: myCharacter.animations[myCharacter.currentAnimation].height * myCharacter.scaleFactor
        };

        // Check collision with boba
        if (checkCollision(myCharacter.x, myCharacter.y, charSize.width, charSize.height, bobaX, bobaY, bobaSize)) {
            score++;
            goodFoodSound.play(); // Play sound effect for eating boba
            console.log("Boba eaten! Score: " + score);
            moveBobaToNewLocation();
        }

        // Check collision with tidepod
        if (checkCollision(myCharacter.x, myCharacter.y, charSize.width, charSize.height, tidepodX, tidepodY, bobaSize)) {
            score--; // Lose a point
            badFoodSound.play(); // Play sound effect for eating tidepod
            console.log("Tidepod eaten! Score: " + score);
            moveTidepodToNewLocation();
        }

        // Display score and timer
        fill(0);
        textSize(20);
        text(`Score: ${score}`, 20, 30);
        text(`Time: ${gameTime}s`, 20, 60);
    } else {
        fill(255, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2);
        text(`Final Score: ${score}`, width / 2, height / 2 + 40);

        // Stop background music when game ends
        bgMusic.stop();
    }
}

function keyPressed() {
    keys[key] = true;
}

function keyReleased() {
    keys[key] = false;
}

// Simple collision detection (replaces p5.collide2D)
function checkCollision(x1, y1, w1, h1, x2, y2, size) {
    return (
        x1 < x2 + size &&
        x1 + w1 > x2 &&
        y1 < y2 + size &&
        y1 + h1 > y2
    );
}

function moveBobaToNewLocation() {
    bobaX = random(width - bobaSize);
    bobaY = random(height - bobaSize);
}

function moveTidepodToNewLocation() {
    tidepodX = random(width - bobaSize);
    tidepodY = random(height - bobaSize);
}
