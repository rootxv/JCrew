function Stage1(p, c){
	this.parent = p;
	this.stage = new createjs.Stage(c);
	this.direction = 0;
	this.backgroundArray = new Array(); this.backgroundArrayTime = new Array();
	this.backgroundArray2 = new Array(); this.backgroundArrayTime2 = new Array();
	this.player = new Object;
	this.velocity = 0;
	this.laneYArray = [340,400,475]; this.currentLane=1; this.canSwitchLanes=true; this.inGrace = false;
	this.enemyImgArray = new Array(); this.enemyArray = new Array(); this.enemyTimer = 120;
	this.STATE = 0; this.TIMER = 120; this.TIMER_TEXT=120;
	this.damage_hud = new Object; this.damage_bar = new Object;

	createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	createjs.Ticker.setFPS(60);

	this.queue = new createjs.LoadQueue(false);
	this.queue.installPlugin(createjs.Sound);
	this.queue.addEventListener("complete", this.handleComplete.bind(this));
	this.queue.loadManifest([{id:"bg_sky", src:"images/Stage1/bg_sky.png"},
							 {id:"bg_ocean", src:"images/Stage1/bg_ocean.png"},
	 						 {id:"bg_sun", src:"images/Stage1/bg_sun.png"},
	 						 {id:"bg_waves", src:"images/Stage1/bg_waves.png"},
	 						 {id:"bg_sand_far", src:"images/Stage1/bg_sand_far.png"},
	 						 {id:"bg_sand", src:"images/Stage1/bg_sand.png"},
	 						 {id:"bg_road", src:"images/Stage1/bg_road.jpg"},
	 						 {id:"player_img", src:"images/Stage1/player_truck.png"},
	 						 {id:"bg_clouds", src:"images/Stage1/bg_clouds.png"},
	 						 {id:"enemy_car", src:"images/Stage1/enemy_car.png"},
	 						 {id:"enemy_truck", src:"images/Stage1/enemy_truck.png"},
	 						 {id:"enemy_convertible", src:"images/Stage1/enemy_convertible.png"},
	 						 {id:"text_stage1", src:"images/Stage1/text_stage1.png"},
	 						 {id:"win_stage1", src:"images/Stage1/win_stage1.png"},
	 						 {id:"lose_stage1", src:"images/Stage1/lose_stage1.png"},
	 						 {id:"damage_hud", src:"images/Stage1/damage_hud.png"}]);
}
Stage1.prototype.tick = function(event){
	if(this.STATE==1){
		this.handlePlayerMovement();
		this.handleEnemySpawn();
		this.handleEnemyMovement();
		this.checkCollision();
		this.setTimerDisplay();
	}
	this.stage.update();
}
Stage1.prototype.handleComplete = function(event){
	console.log("queue complete - handling...");
	var q = event.target;
	this.loadBackground(q);
	this.player.img = new createjs.Bitmap(q.getResult("player_img"));
	this.enemyImgArray = ["enemy_car", "enemy_convertible", "enemy_truck"];
	this.player.img.x = 50; this.player.img.y = this.laneYArray[1]; this.stage.addChild(this.player.img);
	this.player.damage = 0;
	this.createIntro();
	createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	createjs.Ticker.setFPS(60);
	document.onkeydown = this.handleKeyDown.bind(this);
	document.onkeyup = this.handleKeyUp.bind(this);
}
Stage1.prototype.loadBackground = function(q){
	var sky = createbmp(q, "bg_sky");
	var ocean = createbmp(q, "bg_ocean"); var ocean2 = createbmp(q, "bg_ocean");
	var sun = createbmp(q, "bg_sun");
	var waves = createbmp(q, "bg_waves"); var waves2 = createbmp(q, "bg_waves");
	var sand_far = createbmp(q, "bg_sand_far"); var sand_far2 = createbmp(q, "bg_sand_far");
	var sand = createbmp(q, "bg_sand"); var sand2 = createbmp(q, "bg_sand");
	var road = createbmp(q, "bg_road"); var road2 = createbmp(q, "bg_road");
	var clouds = createbmp(q, "bg_clouds");
	this.backgroundArray = [sky,ocean,sun,clouds,waves,sand_far,sand,road];
	this.backgroundArrayTime = [0,20,0,0,10.5,5,3,3];
	this.backgroundArray2 = [ocean2, waves2,sand_far2,sand2,road2];
	this.backgroundArrayTime2 = [20,10.5,5,3,3];

	this.stage.addChild(sky);
	ocean.y = 202; this.stage.addChild(ocean);
	ocean2.y = 202; ocean2.x = 960; this.stage.addChild(ocean2);
	this.stage.addChild(sun);
	this.stage.addChild(clouds);
	this.stage.addChild(waves);
	waves2.x = 960; this.stage.addChild(waves2);
	this.stage.addChild(sand_far);
	sand_far2.x = 960; this.stage.addChild(sand_far2);
	this.stage.addChild(sand);
	sand2.x = 960; this.stage.addChild(sand2);
	road.y = 400;
	this.stage.addChild(road);
	road2.y = 400; road2.x = 960; this.stage.addChild(road2);
}
Stage1.prototype.addParallax = function(){
	for(var i = 0; i<this.backgroundArray.length; i++){
		if(this.backgroundArrayTime[i]!=0){
			createjs.Tween.get(this.backgroundArray[i], {loop:true}).to({x:-960}, 1000*this.backgroundArrayTime[i]);
		}
	}
	for(var i = 0; i<this.backgroundArray2.length; i++){
		createjs.Tween.get(this.backgroundArray2[i], {loop:true}).to({x:0}, 1000*this.backgroundArrayTime2[i]);
	}
}
Stage1.prototype.createIntro = function(){
	var introText = createbmp(this.queue, "text_stage1");
	introText.x = 200; introText.y = 75;
	this.stage.addChild(introText);
	introText.addEventListener("click", this.startStage(introText));
}
Stage1.prototype.handleKeyDown = function(e){
	if(!e){ var e = window.event; }
	switch(e.keyCode){
		case KEYCODE_A: ;
		case KEYCODE_LEFT:
			this.direction = -1;
			break;
		case KEYCODE_D: ;
		case KEYCODE_RIGHT:
			this.direction = 1;
			break;
		case KEYCODE_W: ;
		case KEYCODE_UP:
			if(this.currentLane!=0){
				this.switchLanes(-1);
				this.canSwitchLanes = false;
			}
			break;
		case KEYCODE_S: ;
		case KEYCODE_DOWN:
			if(this.currentLane!=2){
				this.switchLanes(1);
				this.canSwitchLanes = false;
			}
			break;
	}
}
Stage1.prototype.handleKeyUp = function(e){
	if(!e){ var e = window.event; }
	switch(e.keyCode){
		case KEYCODE_A: ;
		case KEYCODE_LEFT: ;
			if(this.direction == -1){
				this.direction = 0;
			}
			break;
		case KEYCODE_D: ;
		case KEYCODE_RIGHT: ;
			if(this.direction == 1){
				this.direction = 0;
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
Stage1.prototype.handlePlayerMovement = function(){
	if(this.player.img.x>0 && this.player.img.x<960-134){
		if(this.direction==1){
			this.velocity = 2.7;
		}else if(this.direction==-1){
			this.velocity = -3.0;
		}else if(this.direction==0){
			if(this.velocity>.1){
				this.velocity -= .1;
			}else if(this.velocity<-.1){
				this.velocity += .1;
			}else{
				this.velocity = 0;
			}
		}
		this.player.img.x += this.velocity;
	}
	if(this.player.img.x<=0){
		this.player.img.x = 1;
	}
	if(this.player.img.x>=960-134){
		this.player.img.x = 959-134;
	}
}
Stage1.prototype.switchLanes = function(dir){
	if(this.canSwitchLanes){
		this.currentLane += dir;
		createjs.Tween.get(this.player.img)
			.to({y:this.laneYArray[this.currentLane]},400)
			.call(onLaneChangeComplete.bind(this));
	}
	function onLaneChangeComplete(){
		this.canSwitchLanes = true;
	}
}
var Enemy = function(p,k,s,l){
	this.speed = s;
	this.img = createbmp(p.queue, p.enemyImgArray[k]);
	this.img.x = 950; this.img.y = p.laneYArray[l];
	this.lane = l;
	this.move = function(){
		this.img.x -= this.speed/10;
		if(this.img.x<-150){
			p.stage.removeChild(this.img);
			delete this;
		}
	}
}
Stage1.prototype.handleEnemySpawn = function(sp){
	if(sp==false){return;}
	this.enemyTimer -= 1;
	if(this.enemyTimer==0){
		this.createNewEnemy();
		this.enemyTimer = Math.round(Math.random()*180 + 60);
	}
}
Stage1.prototype.createNewEnemy = function(){
	var temp = Math.floor(Math.random()*this.enemyImgArray.length);
	var spd = Math.random()*20+10;
	var l = Math.floor(Math.random()*3);
	var en = new Enemy(this, temp, spd, l);
	this.enemyArray.push(en);
	this.stage.addChild(en.img);
	//console.log("enemy created");
}
Stage1.prototype.handleEnemyMovement = function(){
	for(var i = 0; i<this.enemyArray.length; i++){
		this.enemyArray[i].move();
	}
}
Stage1.prototype.checkCollision = function(){
	for(var i = 0; i<this.enemyArray.length; i++){
		if(this.enemyArray[i].lane == this.currentLane){
			if(this.canSwitchLanes && this.inGrace == false){
				if(ndgmr.checkRectCollision(this.player.img, this.enemyArray[i].img)){
					console.log("collision");
					this.handleCollision(this.enemyArray[i], i);
				}
			}
		}
	}
}
Stage1.prototype.startStage = function(txt){
	this.damage_hud = createbmp(this.queue, "damage_hud");
	this.damage_hud.x = 440; this.damage_hud.y = 10;
	this.damage_bar = new createjs.Shape();
	this.damage_bar.graphics.beginFill("#000000").drawRect(0,0,44,6);
	this.damage_bar.x = 440; this.damage_bar.y = 45;
	this.stage.addChild(this.damage_hud);
	this.stage.addChild(this.damage_bar);
	this.addParallax();
	this.stage.removeChild(txt);
	this.STATE = 1;
	this.TIMER_TEXT = new createjs.Text(""+this.TIMER+"","20px Arial","black");
	this.stage.addChild(this.TIMER_TEXT); this.TIMER_TEXT.x = 100; this.TIMER_TEXT.y = 10;
	this.startTimer();
}
Stage1.prototype.startTimer = function(){
	var counter = setInterval(timer.bind(this), 1000);
	function timer(){
		this.TIMER -= 1;
		if(this.TIMER<=0){
			clearInterval(counter);
			this.endStage(true);
			return;
		}
	}
}
Stage1.prototype.setTimerDisplay = function(){
	this.TIMER_TEXT.text = ""+this.TIMER+"";
}
Stage1.prototype.addTime = function(){
	this.TIMER += 10;
}
Stage1.prototype.startGracePeriod = function(){
	this.inGrace = true;
	this.canSwitchLanes = false;
	var counter = setInterval(timer.bind(this), 3000);
	createjs.Tween.get(this.player.img, {loop:true}).to({alpha:.5},400).to({alpha:1},400);
	function timer(){
		createjs.Tween.removeTweens(this.player.img);
		this.inGrace = false;
		this.canSwitchLanes = true;
		this.player.img.alpha = 1;
	}
}
Stage1.prototype.endStage = function(condition){
	if(this.STATE!=2){
		this.STATE=2;
		this.pauseParallax();
		if(condition == true){
			this.createVictoryScreen();
			return;
		}
		this.createLossScreen();
	}
}
Stage1.prototype.pauseParallax = function(){
	createjs.Tween.removeAllTweens();
}
Stage1.prototype.handleCollision = function(enemy, index){
	this.player.damage += 1;
	this.setDamageDisplay();
	console.log("player damage: "+this.player.damage);
	this.canSwitchLanes = false;
	if(this.player.damage >=3){
		this.endStage(false);
		this.canSwitchLanes = false;
		return;
	}
	this.startGracePeriod();
	this.crashEnemy(enemy, index);
}
Stage1.prototype.crashEnemy = function(enemy, index){
	this.stage.removeChild(enemy.img);
	this.enemyArray.splice(index, 1);
}
Stage1.prototype.setDamageDisplay = function(){
	this.damage_bar.scaleX = (1/3)*(3-this.player.damage);
}
Stage1.prototype.createLossScreen = function(){
	console.log("you lose");
	var retry = createbmp(this.queue, "lose_stage1");
	retry.x = 220; retry.y = 100;
	this.stage.addChild(retry);
	retry.addEventListener("click", fn.bind(this));
	function fn(e){
		restartStage();
	}
}
Stage1.prototype.createVictoryScreen = function(){
	console.log("you win");
	var success = createbmp(this.queue, "win_stage1");
	success.x = 220; success.y = 100;
	this.stage.addChild(success);
	success.addEventListener("click", fn.bind(this));
	function fn(e){
		if(this.parent!=null){
			this.parent.endStage();
			this.parent.nextStage();
		}
	}
}
Stage1.prototype.restartStage = function(){
	console.log("restarted");
	//code for stage restart goes here
}