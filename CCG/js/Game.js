var KEYCODE_UP = 38; KEYCODE_W = 87; KEYCODE_DOWN = 40; KEYCODE_S = 83;
var KEYCODE_LEFT = 37; KEYCODE_A = 65; KEYCODE_RIGHT = 39; KEYCODE_D = 68;
var game;


function Game(c){
	this.canvas = c;
	this.stages = new Array();
	this.CURRENT_STAGE = 0;

	console.log("new game started");
	game = this;
	this.intro = new Intro(this, this.canvas);
	this.stages[0] = this.intro;
}
Game.prototype.nextStage = function(){
	console.log("next stage");
	this.stage1 = new Stage1(this, this.canvas);
}


function Intro(p, c){
	this.p = p;
	this.stage = new createjs.Stage(c);

	createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	createjs.Ticker.setFPS(60);
	this.ended = false;

	this.queue = new createjs.LoadQueue(false);
	this.queue.installPlugin(createjs.Sound);
	this.queue.addEventListener("complete", this.handleComplete.bind(this));
	this.queue.loadManifest([{id:"bg", src:"images/Intro/intro_background.png"},
							 {id:"arrow", src:"images/Intro/arrow.png"},
							 {id:"clouds_bg", src:"images/Intro/clouds_bg.png"},
							 {id:"clouds_fg", src:"images/Intro/clouds_fg.png"},
							 {id:"plane", src:"images/Intro/plane.png"},
							 {id:"play", src:"images/Intro/play.png"},
							 {id:"sun_rays", src:"images/Intro/sun_rays.png"},
							 {id:"sun", src:"images/Intro/sun.png"},
							 {id:"title", src:"images/Intro/title.png"},
							 {id:"globe", src:"images/Intro/globe.png"},
							 {id:"small_text", src:"images/Intro/small_text.png"},]);
}
Intro.prototype.tick = function(event){
	//if(this.ended == false){
		this.stage.update();
	//}
}
Intro.prototype.handleComplete = function(event){
	console.log("queue completed - handling...");
	var q = event.target;
	function add(str,temp,x,y){
		var img = temp.stage.addChild(new createjs.Bitmap(q.getResult(str)));
		img.x = x;
		img.y = y;
		return img;
	}
	add("bg", this,0,0);
	add("clouds_bg", this,0,0);
	add("sun", this,701,0);
	var temp2 = add("sun_rays", this,639,0); createjs.Tween.get(temp2, {loop:true}).to({scaleX:1.15, scaleY:1.15,x:610},1500, createjs.Ease.circIn).to({scaleX:1, scaleY:1,x:639},1500, createjs.Ease.circOut);
	add("globe", this,0,128);
	add("play", this,640,275).addEventListener("mousedown", this.deleteStage.bind(this));
	add("arrow", this,800,287);
	add("title", this,150,60);
	var temp = add("plane", this,100,230); createjs.Tween.get(temp, {loop:true}).to({y:270}, 2000, createjs.Ease.sineInOut).to({y:230},2000,createjs.Ease.sineInOut);
	/*
	var data = {
		images:["images/Intro/bird1.png","images/Intro/bird2.png"],
		frames:{width:32, height:32, count:2},
		animations:{flap:[0,1]}
	};
	var sprite = new createjs.SpriteSheet(data);
	var anim = new createjs.Sprite(sprite, "flap");
	*/
	add("clouds_fg", this,0,0);
	add("small_text", this,5,615);
	console.log("handled");
}
Intro.prototype.deleteStage = function(){
	console.log("deleting stage")
	this.stage.removeAllChildren();
	this.p.nextStage();
}





























function createbmp(q, id){
	return new createjs.Bitmap(q.getResult(id));
}