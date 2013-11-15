var sceneNum, sceneName, assets, assetsPos, stage;
var queue;
var backgroundArray = new Array();

var Scene = function(sname,snum,ass,asspos,stg){
	this.sceneName = sname;
	this.sceneNum = snum;
	this.assets = ass;
	this.assetsPos = asspos;
	this.stage = stg;

	this.queue = new createjs.LoadQueue(false);
	this.queue.installPlugin(createjs.Sound);
	this.queue.addEventListener("complete", handleComplete);
	this.loadManifest();
}
Scene.prototype.loadManifest(){
	this.queue.loadManifeset(assets);
}
Scene.prototype.loadBackground(){
	for(int i=0; i<assets.length; i++){
		var temp = new createjs.Bitmap(queue.getResult(assets[i]));
		temp.x = assetsPos[i][0];
		temp.y = assetsPos[i][1];
		this.backgroundArray[i] = temp;
		this.stage.addChild(temp);
	}
}

Scene.prototype.handleComplete(){

}