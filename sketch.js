let player;

let platform;
let boundry;
let barriers;
let coins;
let specialMove;
let powerUp;
let missileInterval;
let stageInterval;
let screenClearInterval;
let robot;
let fireball;
let screenClear;

var bgImg1;
var bgImg2;
let currentBg;

var x1 = 0;
var x2;
var scrollSpeed = 2;


var speedScale = 4;
var score = 0;
var loss = false;
var powerUpCounter = 1;
var powerUpReady = 0;
var enemySpawnrate = 1;
var coinSpawnrate = 3;
var levelSelect = 0;
var highScore = 0;
var stage = 1;

var timer;
var stageTimer = 0;
var startTime = 0;
var elapsedTime = 0;
var missileTimer = 0;

function preload(){
  screenWipeAnimation = loadAnimation("screenclear.png");
  bgImg1 = loadImage("stage1/Pbackground(2).png");
  bgImg2 = loadImage("stage2/oceanbackground.png");

  titleImg = loadImage('titlescreen.png');
  scoreImg = loadImage('scorecounter.png');


  playerAni1 = loadAnimation("stage1/Pknight.png",{
		width: 50, height: 50, frames: 2
	});
  playerAni2 = loadAnimation("stage2/Diver.png",{
		width: 50, height: 50, frames: 2
	});
  
  enemyAni1 = loadAnimation("stage1/Pblock.png");
  enemyAni2 = loadAnimation("stage2/Block2.png");

  fireballAni1 = loadAnimation("stage1/Pslash_.png");
  fireballAni2 = loadAnimation("stage2/anchor.png");

  coinAni1 = loadAnimation("stage1/Coin-1.png");
  coinAni2 = loadAnimation("stage1/Coin-1.png");

  missileAni1 = loadAnimation("stage1/cursedsword.png");
  missileAni2 = loadAnimation("stage2/Missile_2.png");

  font = loadFont('PressStart2P-Regular.ttf'); 
}

function setup() {
  displayMode('centered', 'pixelated',);
  new Canvas(800, 600);

  textFont(font);
  textLeading(20)
  


  player = new Group();

  boundry = new Group();

  powerUp = new Group();
  powerUp.collider = "none";

  barriers = new Group();
  barriers.collider = "none";
  barriers.overlaps(boundry, kill);
  barriers.overlaps(powerUp, kill);
  barriers.overlaps(player, lose);

  coins = new Group();
  coins.collider = "none";
  coins.overlaps(player, collect);
  coins.overlaps(boundry, coinKill);

  specialMove = new Group
  coins.collider = "none";
  coins.overlaps(player, collect);

  allSprites.pixelPerfect = true;
  
  x2 = width;
}

function draw() {
  if (levelSelect == 0) {
    titleScreen();
  }
  if (levelSelect == 1) {
    level();
  }
}

function level() {
  clear();
  background(0);
 
  if (stageTimer == 1){
    currentBg = bgImg1;
    robot.changeAni('test1');
    robot.collider = DYNAMIC;
    world.gravity.y = 0;
    if (mouse.pressing() || keyIsDown(87) ==true) {
      robot.bearing = -90;
      robot.applyForce(10);
      robot.x = 150;
    };
    if (keyIsDown(83) ==true) {
      robot.bearing = -90;
      robot.applyForce(-10);
      robot.x = 150;
    };
  } else if(stageTimer == 2){
    currentBg = bgImg2;
    robot.changeAni('test2');
    robot.collider = DYNAMIC;
    world.gravity.y = 8;
    if (mouse.pressing() || keyIsDown(87) ==true) {
      robot.bearing = -90;
      robot.applyForce(20);
      robot.x = 150;
    };
    if (keyIsDown(83) ==true) {
      robot.bearing = -90;
      robot.applyForce(-5);
      robot.x = 150;
    };
  };

  image(currentBg, x1, 0, width+1, height);
  image(currentBg, x2, 0, width+1, height);



  if (loss == false ){
   x1 -= speedScale;
   x2 -= speedScale;
  }
  if (x1 <= -width) {
    x1 = x2 + width;
  }
  if (x2 <= -width) {
    x2 = x1 + width;
  }


  playerAni1.frameDelay = (16 - floor(speedScale/2));
  playerAni2.frameDelay = (16 - floor(speedScale/2));


  if (loss == false) {
    elapsedTime = floor((millis() - startTime) / 1000);
  };

  if ((elapsedTime < 5) & (loss == false)) {
    textSize(16);
    textAlign(CENTER);
    fill(255);
    text(`Hold W/S to Move Up/Down\nPress SPACE to launch a projectile`, 400, 250);
  };

  if ((speedScale <= 12) & (loss == false)) {
    speedScale = 5 + elapsedTime / 20;
  };



  for (let i = 0; i < powerUp.length; i++) {
    if (powerUp[i].x > 1200) {
      console.log(`Test Powerup Destroyed`);
      powerUp[i].remove();
    }
  };

  for (let i = 0; i < barriers.length; i++) {
    if (barriers[i].x < -100) {
      console.log(`Test Powerup Destroyed`);
      barriers[i].remove();
    }
  };
    /* old while loop: while (barriers.length < enemySpawnrate + floor(elapsedTime / 20)) */
    for (let i = barriers.length;barriers.length < enemySpawnrate + floor(elapsedTime / 30); i++) {
        let barrier = new barriers.Sprite(
          random(1000, 1600),
          random(100, 500),
          50,
          100
        );
        barrier.direction = 180;
        barrier.speed = speedScale;
        barrier.color = "red";
        barrier.rotation = random(-45, 45);
        barrier.addAnimation('1', enemyAni1);
        barrier.addAnimation('2', enemyAni2);
        if (stageTimer == 1){
          barrier.changeAni('1');
        } else if(stageTimer == 2){
          barrier.changeAni('2');
        };
    }
      if (elapsedTime > 65)
       if (missileTimer > 0) {
        missileTimer = 0;
        clearInterval(missileInterval);
        missileInterval = setInterval(missileToken, 6600 - elapsedTime * 10);
        let missile = new barriers.Sprite(random(900, 1100), robot.y, 100, 25);
        missile.direction = 180;
        missile.speed = speedScale + 3;
        missile.color = "orange";
        missile.layer = 2
        missile.addAnimation('1', missileAni1);
        missile.addAnimation('2', missileAni2);
        if (stageTimer == 1){
          missile.changeAni('1');
        } else if(stageTimer == 2){
          missile.changeAni('2');
        };
       }


  for (let i = coins.length; coins.length < coinSpawnrate + floor(elapsedTime / 45); i++) {
    let coin = new coins.Sprite(random(850, 1400), random(100, 500), 30, 30);
    coin.direction = 180;
    coin.speed = speedScale;
    coin.color = "green";
    coin.layer = 1;
    coin.addAnimation('1', coinAni1);
    coin.addAnimation('2', coinAni2);
    if (stageTimer == 1){
      coin.changeAni('1');
    } else if(stageTimer == 2){
      coin.changeAni('2');
    };
  }

  if (loss == true) {
    textSize(16);
    textAlign(CENTER);
    fill(255);
    text(
      `Game Over!\nFinal Score:${score+elapsedTime}\nHigh Score:${highScore}\n\nPress 'R' to Restart\nPress 'Q' to Quit`,
      400,
      250
    );
  } else {
    image(scoreImg, 6, 6);
    fill(0);
    textAlign(LEFT);
    textSize(10);
    text(
      `Timer: ${elapsedTime}\nScore: ${score}\nPower: ${powerUpReady}`,
      40,
      40
    );
  }
}

function titleScreen() {
  clear();
  background(0);
  fill(255);
  textSize(18);
  textAlign(CENTER);
  image(titleImg, 0, 0);
  text(`Dimensional Rift`, 200, 300);
  textSize(12);
  textAlign(CENTER);
  text(`Press SPACE to Play`, 200, 400);
}

function respawn() {
  clearInterval(missileInterval);
  clearInterval(stageInterval);

  allSprites.remove();

  platform = new Sprite(400, 0, 1000, 100, "s");
  platform.opacity = 0;
  platform = new Sprite(400, 600, 1000, 100, "s");
  platform.opacity = 0;

  killLeft = new boundry.Sprite(-250, 250, 10, 1000, "n");

  robot = new player.Sprite(150, 400);
  robot.addAnimation('test1', playerAni1);
  robot.addAnimation('test2', playerAni2);
  robot.diameter = 50;
  robot.rotationLock = true;
  robot.bounciness = 0;
  robot.drag = 0;
  robot.mass = 1;
  robot.changeAni('test1');


  powerUpCounter = 1;
  powerUpReady = 0;
  speedScale = 5;
  score = 0;
  startTime = millis();
  missileTimer = 0;
  stageTimer = 1;


  loss = false;
  missileInterval = setInterval(missileToken, 6000);
  stageInterval = setInterval(stageSwitch, 60000);
}

function kill(barrier, boundry, powerUp) {
  barrier.remove();
}
function coinKill(coin, boundry) {
  coin.remove();
}

function lose(barrier, robot) {
  allSprites.remove();
  loss = true;
  speedScale = -10;
  if (highScore < score+elapsedTime) {
    highScore = score+elapsedTime;
  }
  
  clearInterval(missileInterval);
  clearInterval(stageInterval);
  clearInterval(screenClearInterval);
}

function collect(coin, robot) {
  coin.remove();
  score += 1;
  if (powerUpCounter >= 10) {
    powerUpCounter = 1;
    powerUpReady += 1;
    powerUpCharge();
  } else {
    powerUpCounter += 1;
    powerUpCharge();
  }
}

function powerUpCharge() {
  console.log(`Test Powerup Charge: ${powerUpCounter}`);
}

function keyPressed() {
  if (
    (key == " ") &
    (powerUpReady >= 1) &
    (loss == false) &
    (levelSelect == 1)
  ) {
    powerUpReady -= 1;
    fireball = new powerUp.Sprite(robot.x, robot.y, 50, 150, "none");
    fireball.speed = 8;
    fireball.addAnimation('1', fireballAni1);
    fireball.addAnimation('2', fireballAni2);
    if (stageTimer == 1){
      fireball.changeAni('1');
    } else if(stageTimer == 2){
      fireball.changeAni('2');
    };
  }
  if (
    (key == "s") &
    (powerUpReady >= 1) &
    (loss == false) &
    (levelSelect == 1)
  ) {

  }
  if ((key == "r") & (levelSelect == 1) & (loss == true)) {
    respawn();
  }
  if ((key == " ") & (levelSelect == 0)) {
    levelSelect = 1;
    respawn();
  }
  if ((key == "q") & (levelSelect == 1) & (loss == true)) {
    allSprites.remove();
    levelSelect = 0;
  }
}

function missileToken() {
  missileTimer++;
}

function stageSwitch() {
 screenClearInterval = setInterval(screenClearEffect, 300);
 screenClear = new powerUp.Sprite(-1000, 300, 1200, 600, "none");
 screenClear.speed = 50;
 screenClear.layer = 10;
 screenClear.addAnimation('screen', screenWipeAnimation);
}


function screenClearEffect(){
  if (stageTimer < 2){
    stageTimer++;
  } else {
    stageTimer = 1;
  }
  clearInterval(screenClearInterval);
}
