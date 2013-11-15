var stage, queue, direction;
var KEYCODE_UP = 38; KEYCODE_W = 87; KEYCODE_DOWN = 40; KEYCODE_S = 83;
var KEYCODE_LEFT = 37; KEYCODE_A = 65; KEYCODE_RIGHT = 39; KEYCODE_D = 68;
var backgroundArray, backgroundArrayTime;
var player = new Object;
var velocity = 0;
var laneYArray = [340,400,475], currentLane=1, canSwitchLanes = true, inGrace = false;
var enemyImgArray = new Array(), enemyArray = new Array(), enemyTimer=120;
var STATE = 0, TIMER = 120, TIMER_TEXT;
var damage_hud, damage_bar;
var parent;

function init(p){
	stage = new createjs.Stage("myCanvas");
	parent = p;

	queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("complete",handleComplete);
	//queue.loadManifest([{id:"sun", src:"images/bg_sun.png"},{id:"sound", src:"hit.mp3"}]);
	queue.loadManifest([{id:"bg_sky", src:"images/bg_sky.png"},
						{id:"bg_ocean", src:"images/bg_ocean.png"},
						{id:"bg_sun", src:"images/bg_sun.png"},
						{id:"bg_waves", src:"images/bg_waves.png"},
						{id:"bg_sand_far", src:"images/bg_sand_far.png"},
						{id:"bg_sand", src:"images/bg_sand.png"},
						{id:"bg_road", src:"images/bg_road.jpg"},
						{id:"player_img", src:"images/player_truck.png"},
						{id:"bg_clouds", src:"images/bg_clouds.png"},
						{id:"enemy_car", src:"images/enemy_car.png"},
						{id:"enemy_truck", src:"images/enemy_truck.png"},
						{id:"enemy_convertible", src:"images/enemy_convertible.png"},
						{id:"text_stage1", src:"images/text_stage1.png"},
						{id:"win_stage1", src:"images/win_stage1.png"},
						{id:"lose_stage1", src:"images/lose_stage1.png"},
						{id:"damage_hud", src:"images/damage_hud.png"}]);
}
function handleComplete(event){
	loadBackground();
	player.img = new createjs.Bitmap(queue.getResult("player_img"));
	enemyImgArray = ["enemy_car", "enemy_convertible", "enemy_truck"];
	player.img.x = 50; player.img.y = laneYArray[1]; stage.addChild(player.img);
	player.damage = 0;
	createIntro();
	createjs.Ticker.addEventListener("tick",tick);
	createjs.Ticker.setFPS(60);
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
}
function tick(event){
	if(STATE==1){
		handlePlayerMovement();
		handleEnemySpawn();
		handleEnemyMovement();
		checkCollision();
		setTimerDisplay();
	}
	stage.update();
}
function loadBackground(){
	var sky = new createjs.Bitmap(queue.getResult("bg_sky"));
	var ocean = new createjs.Bitmap(queue.getResult("bg_ocean"));var ocean2 = new createjs.Bitmap(queue.getResult("bg_ocean"));
	var sun = new createjs.Bitmap(queue.getResult("bg_sun"));
	var waves = new createjs.Bitmap(queue.getResult("bg_waves"));var waves2 = new createjs.Bitmap(queue.getResult("bg_waves"));
	var sand_far = new createjs.Bitmap(queue.getResult("bg_sand_far")); var sand_far2 = new createjs.Bitmap(queue.getResult("bg_sand_far"));
	var sand = new createjs.Bitmap(queue.getResult("bg_sand"));var sand2 = new createjs.Bitmap(queue.getResult("bg_sand"));
	var road = new createjs.Bitmap(queue.getResult("bg_road"));var road2 = new createjs.Bitmap(queue.getResult("bg_road"));
	var clouds = new createjs.Bitmap(queue.getResult("bg_clouds"));
	backgroundArray = [sky,ocean,sun,clouds,waves,sand_far,sand,road];
	backgroundArrayTime = [0,20,0,0,10.5,5,3,3];
	backgroundArray2 = [ocean2,waves2,sand_far2,sand2,road2];
	backgroundArrayTime2 = [20,10.5,5,3,3];

	stage.addChild(sky);
	ocean.y = 202; stage.addChild(ocean);
	ocean2.y = 202; ocean2.x = 960; stage.addChild(ocean2);
	stage.addChild(sun);
	stage.addChild(clouds);
	stage.addChild(waves);
	waves2.x = 960; stage.addChild(waves2);
	stage.addChild(sand_far);
	sand_far2.x = 960; stage.addChild(sand_far2);
	stage.addChild(sand);
	sand2.x = 960; stage.addChild(sand2);
	road.y = 400;
	stage.addChild(road);
	road2.y = 400; road2.x = 960;
	stage.addChild(road2);

	//addParallax();
}
function addParallax(){
	for(var i = 0; i<backgroundArray.length; i++){
		if(backgroundArrayTime[i]!=0){
			createjs.Tween.get(backgroundArray[i], {loop:true}).to({x:-960}, 1000*backgroundArrayTime[i]);
		}
	}
	for(var i = 0; i<backgroundArray2.length; i++){
		createjs.Tween.get(backgroundArray2[i], {loop:true}).to({x:0}, 1000*backgroundArrayTime2[i]);
	}
}
function handleKeyDown(e){
	if(!e){ var e = window.event; }
	switch(e.keyCode){
		case KEYCODE_A: ;
		case KEYCODE_LEFT:
			direction = -1;
			//console.log("moving left");
			break;
		case KEYCODE_D: ;
		case KEYCODE_RIGHT:
			direction = 1;
			//console.log("moving right");
			break;
		case KEYCODE_W: ;
		case KEYCODE_UP:
			if(currentLane!=0){
				switchLanes(-1);
				canSwitchLanes = false;
			}
			//console.log("moving up");
			break;
		case KEYCODE_S: ;
		case KEYCODE_DOWN:
			if(currentLane!=2){
				switchLanes(1);
				canSwitchLanes = false;
			}
			//console.log("moving down");
			break;
	}
}
function handleKeyUp(e){
	if(!e){ var e = window.event; }
	switch(e.keyCode){
		case KEYCODE_A: ;
		case KEYCODE_LEFT: ;
			if(direction == -1){
				direction = 0;
			}
			break;
		case KEYCODE_D: ;
		case KEYCODE_RIGHT: ;
			if(direction == 1){
				direction = 0;
			}
			break;
		case KEYCODE_W: ;
		case KEYCODE_UP: ;
			break;
		case KEYCODE_S: ;
		case KEYCODE_DOWN:
			break;
	}
}
function handlePlayerMovement(){
	if(player.img.x>0 && player.img.x<960-134){
		if(direction==1){
			velocity = 3;
		}else if(direction==-1){
			velocity = -3.5;
		}else if(direction==0){
			if(velocity>.1){
				velocity -= .1;
			}else if(velocity<-.1){
				velocity += .1;
			}else{
				velocity = 0;
			}
		}
		player.img.x += velocity;
	}
	if(player.img.x<=0){
		player.img.x = 1;
	}
	if(player.img.x>=960-134){
		player.img.x = 959-134;
	}
}
function switchLanes(dir){
	if(canSwitchLanes){
		var toLane = currentLane+dir;
		//console.log(currentLane,toLane);
		currentLane = toLane;
		createjs.Tween.get(player.img)
			.to({y:laneYArray[currentLane]},400)
			.call(onLaneChangeComplete);
	}
	function onLaneChangeComplete(){
		canSwitchLanes = true;
	}
}
var Enemy = function(k, s, l){
	this.speed = s;
	this.img = new createjs.Bitmap(queue.getResult(enemyImgArray[k]));
	this.img.x = 950; this.img.y = laneYArray[l];
	this.lane = l;
	this.move = function(){
		this.img.x -= this.speed/10;
		if(this.img.x<-150){
			stage.removeChild(this.img);
			delete this;
		}
	}
}
function handleEnemySpawn(sp){
	if(sp==false){return;}
	enemyTimer -= 1;
	if(enemyTimer==0){
		createNewEnemy();
		enemyTimer = Math.round(Math.random()*180 + 60);
	}
}
function createNewEnemy(){
	var temp = Math.floor(Math.random()*enemyImgArray.length);
	var spd = Math.random()*20+10;
	var l = Math.floor(Math.random()*3);
	var en = new Enemy(temp, spd, l);
	enemyArray.push(en);
	stage.addChild(en.img);
	console.log("enemy created");
	//console.log(""+temp+", "+spd+", "+l+"");
}
function handleEnemyMovement(){
	for(var i = 0;i<enemyArray.length; i++){
		enemyArray[i].move();
	}
}
function checkCollision(){
	for(var i = 0; i<enemyArray.length; i++){
		if(enemyArray[i].lane == currentLane){
			if(canSwitchLanes && inGrace == false){
				if(ndgmr.checkRectCollision(player.img, enemyArray[i].img)){
					console.log("collision");
					handleCollision(enemyArray[i], i);
				}
			}
		}
	}
}
function createIntro(){
	var introText = new createjs.Bitmap(queue.getResult("text_stage1"));
	introText.x = 200; introText.y = 75;
	stage.addChild(introText);
	introText.addEventListener("click", function(e){
		startStage(introText);
	});
}
function startStage(txt){
	damage_hud = new createjs.Bitmap(queue.getResult("damage_hud"));
	damage_hud.x = 440; damage_hud.y = 10;
	damage_bar = new createjs.Shape();
	damage_bar.graphics.beginFill("#000000").drawRect(0,0,44,6);
	damage_bar.x = 440; damage_bar.y = 45;
	stage.addChild(damage_hud);
	stage.addChild(damage_bar);
	addParallax();
	stage.removeChild(txt);
	STATE = 1;
	TIMER_TEXT = new createjs.Text(""+TIMER+"", "20px Arial", "black");
	stage.addChild(TIMER_TEXT); TIMER_TEXT.x = 100; TIMER_TEXT.y = 10;
	startTimer();
}
function startTimer(){
	var counter = setInterval(timer, 1000);
	function timer(){
		TIMER -= 1;
		if(TIMER <= 0){
			clearInterval(counter);
			endStage(true);
			return;
		}
	}
}
function setTimerDisplay(){
	TIMER_TEXT.text = ""+TIMER+"";
}
function addTime(){
	TIMER += 10;
}
function startGracePeriod(){
	inGrace = true;
	canSwitchLanes = false;
	var counter = setInterval(timer, 3000);
	createjs.Tween.get(player.img, {loop:true}).to({alpha:.5}, 400).to({alpha:1}, 400);
	function timer(){
		createjs.Tween.removeTweens(player.img);
		inGrace = false;
		canSwitchLanes = true;
		player.img.alpha = 1;
	}
}
function toggleHittable(){

}
function endStage(condition){
	if(STATE!=2){
		STATE = 2;
		pauseParallax();
		if(condition == true){
			createVictoryScreen();
			return;
		}
		createLossScreen();
	}
}
function pauseParallax(){
	/*
	for(var i = 0; i<backgroundArray.length; i++){
		createjs.Tween.get(backgroundArray[i]).pause;
	}
	for(var i = 0; i<backgroundArray2.length; i++){
		createjs.Tween.get(backgroundArray2[i]).pause;
	}
	*/
	createjs.Tween.removeAllTweens();
}
function handleCollision(enemy, index){
	player.damage += 1;
	setDamageDisplay();
	console.log("player damage: "+player.damage);
	canSwitchLanes = false;
	if(player.damage >=3){
		endStage(false);
		canSwitchLanes = false;
		return;
	}
	startGracePeriod();
	crashEnemy(enemy, index);
}
function crashEnemy(enemy, index){
	stage.removeChild(enemy.img);
	enemyArray.splice(index, 1);
}
function setDamageDisplay(){
	damage_bar.scaleX = (1/3)*(3-player.damage);
}
function createLossScreen(){
	console.log("you lose");
	var retry = new createjs.Bitmap(queue.getResult("lose_stage1"));
	retry.x = 220; retry.y = 100;
	stage.addChild(retry);
	retry.addEventListener("click", function(e){
		restartStage();
	});
}
function createVictoryScreen(){
	console.log("you win");
	var success = new createjs.Bitmap(queue.getResult("win_stage1"));
	success.x = 220; success.y = 100;
	stage.addChild(success);
	success.addEventListener("click", function(e){
		if(parent!=null){
			parent.endStage();
			parent.nextStage();
		}
	});
}
function restartStage(){
	console.log("restarted");
}











