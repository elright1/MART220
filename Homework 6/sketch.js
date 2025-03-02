let myCharacter;
let animations = [];
let bobaImage;
let bobaX, bobaY;
const bobaSize = 50;
const moveSpeed = 2;
let keys = {}; 

let score = 0;
let gameTime = 5; // ⏳ Timer now starts at 5 seconds
let gameOver = false;
let lastTime = 0;

function preload() {
    for (let i = 1; i <= 9; i++) {
        animations.push(loadImage(`Idle${i}.png`));
    }
    bobaImage = loadImage('boba.png');
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

    getCharacterSize() {
        return {
            width: this.animations[this.currentAnimation].width * this.scaleFactor,
            height: this.animations[this.currentAnimation].height * this.scaleFactor
        };
    }
}

function setup() {
    createCanvas(500, 400);
    myCharacter = new Character('Hero', 100, moveSpeed, animations);
    bobaX = 300;
    bobaY = 200;
    lastTime = millis();
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
        image(bobaImage, bobaX, bobaY, bobaSize, bobaSize);

        let charSize = myCharacter.getCharacterSize();
        if (checkCollision(myCharacter.x, myCharacter.y, charSize.width, charSize.height, bobaX, bobaY, bobaSize)) {
            score++;
            console.log("Boba eaten! Score: " + score);
            moveBobaToNewLocation();
        }

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
    }
}

function keyPressed() {
    keys[key] = true;
}

function keyReleased() {
    keys[key] = false;
}

function checkCollision(charX, charY, charWidth, charHeight, bobaX, bobaY, bobaSize) {
    return (
        charX < bobaX + bobaSize &&
        charX + charWidth > bobaX &&
        charY < bobaY + bobaSize &&
        charY + charHeight > bobaY
    );
}

function moveBobaToNewLocation() {
    bobaX = random(width - bobaSize);
    bobaY = random(height - bobaSize);
}
