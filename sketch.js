
var trex ,trex_running;
var ground;
var groundING;
var invisibleGround;
var cloudIng;
var obstaculo1;
var obstaculo2;
var obstaculo3;
var obstaculo4;
var obstaculo5;
var obstaculo6;
var score = 0;
var gameState = "play";
var obstacleGroup;
var cloudGroup;
var gameover, gameoverimg;
var restart, restartimg;
var trexcollide;
var teroimg, teroGroup;
var checkpointSound, dieSound, jumpSound; 
var trexdownimg;

function preload(){
 trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
 groundING = loadImage("ground2.png")
 cloudIng = loadImage("cloud.png")
 obstaculo1 = loadImage("obstacle1.png");
 obstaculo2 = loadImage("obstacle2.png");
 obstaculo3 = loadImage("obstacle3.png");
 obstaculo4 = loadImage("obstacle4.png");
 obstaculo5 = loadImage("obstacle5.png");
 obstaculo6 = loadImage("obstacle6.png");
 gameoverimg = loadImage("gameOver.png");
 restartimg = loadImage("restart.png");
 trexcollide = loadAnimation("trex_collided.png");
 teroimg = loadAnimation("tero1.png","tero2.png");
 checkpointSound = loadSound ("checkPoint.mp3");
 dieSound = loadSound ("die.mp3");
 jumpSound = loadSound ("jump.mp3");
 trexdownimg = loadAnimation("trex_down1.png","trex_down2.png")
}

function setup(){
  createCanvas(600,200)
  
  //crear sprite de Trex
  trex = createSprite(50,170,20,40);
  ground = createSprite(200,180,400,20);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trexcollide);
  trex.addAnimation("down", trexdownimg);
  trex.scale = 0.5
  ground.addImage(groundING);
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false
  cloudGroup = new Group();
  obstacleGroup = new Group();
  teroGroup = new Group();
  gameover = createSprite(300,100,10,10);
  gameover.addImage(gameoverimg);
  gameover.scale = 0.5;
  gameover.visible = false
  restart = createSprite(300,140,10,10);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false
  //trex.debug = true;
  trex.setCollider ("circle", 0,0,35);  
}

function draw(){
  background("red")
  text("puntuación: " + Math.round(score), 400,50);  
  trex.collide(invisibleGround);

  if(gameState==="play"){
    score += 1/10;

   if(score%100===0 && score>0){
     checkpointSound.play();
   }
   if(keyWentDown("down") && trex.y>150){
     trex.changeAnimation("down", trexdownimg);
     trex.scale = 0.4   
    }
   if(keyWentUp("down") && trex.y>150){
     trex.changeAnimation("running", trex_running);  
     trex.scale = 0.5;
     trex.velocityY = 10;
   }
   if (keyDown("space") && trex.y>150){
     trex.velocityY = -10;
     jumpSound.play ();
   }

   ground.velocityX = -(6+3*score/100);
   if (ground.x<0 ){
     ground.x = ground.width/2;
   }
    //gravedad
   trex.velocityY= trex.velocityY +0.5; 
   spawnCloud();
   creacionObstaculos();

   if(score>700){
     spawnTero();
   }

   if(trex.isTouching(obstacleGroup) || trex.isTouching(teroGroup)){
     gameState= "end";
     dieSound.play ();
    }
  }

  if(gameState==="end"){
    ground.velocityX = 0;
    trex.velocityY = 0
    gameover.visible = true
    restart.visible = true
    obstacleGroup.setVelocityXEach (0);
    cloudGroup.setVelocityXEach (0);
    teroGroup.setVelocityXEach (0);
    obstacleGroup.setLifetimeEach (-1);
    cloudGroup.setLifetimeEach (-1);
    teroGroup.setLifetimeEach (-1);
    trex.changeAnimation ("collide", trexcollide);
    trex.scale = 0.5;
    if(mousePressedOver(restartimg)){
      Restart();
    }
  }

 drawSprites();
}

function Restart(){
  gameState= "play";
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  teroGroup.destroyEach();
  gameover.visible = false;
  restart.visible = false;
  trex.addAnimation("running", trex_running);
  score= 0;
}

function creacionObstaculos(){
  if(frameCount%70 ===0){
    var Obstacle = createSprite(600,160,20,40);
    Obstacle.velocityX = -(6+3*score/100);
    var num= Math.round(random(1,6));
    switch (num){
      case 1: Obstacle.addImage(obstaculo1); break;
      case 2: Obstacle.addImage(obstaculo2); break;
      case 3: Obstacle.addImage(obstaculo3); break;
      case 4: Obstacle.addImage(obstaculo4); break;
      case 5: Obstacle.addImage(obstaculo5); break;
      case 6: Obstacle.addImage(obstaculo6); break;
    }
    Obstacle.scale = 0.5
    Obstacle.lifetime = 200;
    obstacleGroup.add(Obstacle);
  }
}
function spawnCloud(){
  if(frameCount%60 ===0){
    var nube;
   nube = createSprite(550,50,20,20);
   nube.velocityX = -(6+3*score/100);
   nube.addImage(cloudIng);
   nube.y = Math.round(random(10,150))
   nube.scale = 0.5
   trex.depth = nube.depth;
   trex.depth = trex.depth +1
   nube.lifetime = 200
   cloudGroup.add(nube);
  }
}
function spawnTero(){
  if(frameCount%100 ===0){
    var tero;
   tero = createSprite(550,50,20,20);
   tero.velocityX = -(10+3*score/100);
   tero.addAnimation("tero", teroimg);
   tero.y = Math.round(random(10,150))
   tero.lifetime = 200
   teroGroup.add(tero);
  }
}