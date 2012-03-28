//Rozszerzyć do dynamicznego tworzenia canvas na podstawie id z dokumentu
var debugLog = document.getElementById("__log");

var Game = function(_canvas, _debug) {
	//This is constructor function

	this.canvas = document.getElementById(_canvas);
	this.context = this.canvas.getContext("2d");

	//For mouse position -----------
	this.offset_top = 0;
	this.offset_left = 0;
	var t_canvas = this.canvas;

	while(t_canvas && t_canvas.tagName != 'BODY') {
		this.offset_top += t_canvas.offsetTop;
		this.offset_left += t_canvas.offsetLeft;
		t_canvas = t_canvas.offsetParent;
	}
	//------------------------------

	//this.backGround = '#553377';
	this.mouse = {
		x : 0,
		y : 0
	};
	this.player = null;
	//Player instance
	this.contentList = [];
	//All created objects
	this.displayList = [];
	//Only visible objects

	this.animation = new Animation(this.canvas);
	this.physic = new Physic(this.animation, this.contentList);
	this.collision = new Collision(this.canvas, this.contentList);

	this.getMousePosition = function(e) {
		var mouseX = e.clientX - this.offset_left + window.pageXOffset;
		var mouseY = e.clientY - this.offset_top + window.pageYOffset;
		e.stopPropagation();
		return {
			x : mouseX,
			y : mouseY
		};
	};

	this.isMouseOver = function(obj, x, y) {
		return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
	};
	/**
	 * @usage This function is returning an cloned instance of it self.
	 * @return New copy of his class.
	 */
	this.replicate = function() {
		function newClass() {
		}


		newClass.prototype = this;
		return new newClass();
	};
}
//Public
Game.prototype.onMouseMove = function(e) {
	// IE is retarded and doesn't pass the event object
	if(e == null)
		e = window.event;
	// IE uses srcElement, others use target
	var target = e.target != null ? e.target : e.srcElement;

	this.mouse = this.getMousePosition(e);
	e.preventDefault();

};

Game.prototype.getCanvas = function() {
	return this.canvas;

};

Game.prototype.getContext = function() {
	return this.context;

};

Game.prototype.initialize = function() {
	var i = 0;

	this.player = new Sprite('pad_64x128.png', 0, this.context);
	this.player.name = "PLAYER";
	this.player.moveTo(10, 10);
	this.player.setVelocity(-1, 1);
	this.contentList[0] = this.player;
	i++;

	this.top1 = new Sprite('hborder.png', 2, this.context);
	this.top1.setCenter(0, 0);
	this.top1.moveTo(0, -10);
	this.top1.setVelocity(1, -1);
	//zmienia jedynie kierunek w pionie
	this.top1.name = "TOP";
	this.top1.draw();
	this.contentList[1] = this.top1;
	i++;

	this.bottom1 = new Sprite('hborder.png', 2, this.context);
	this.bottom1.setCenter(0, 0);
	this.bottom1.moveTo(0, this.canvas.height + 1);
	this.bottom1.setVelocity(1, -1);
	this.bottom1.name = "BOTTOM";
	this.bottom1.draw();
	this.contentList[2] = this.bottom1;
	i++;

	this.right1 = new Sprite('vborder.png', 2, this.context);
	this.right1.setCenter(0, 0);
	this.right1.moveTo(this.canvas.width + 1, 0);
	this.right1.setVelocity(-1, 1);
	this.right1.name = "RIGHT";
	this.right1.draw();
	this.contentList[3] = this.right1;

	this.ball = new Sprite('ball_64x64.png', 5, this.context);
	this.ball.moveTo(199, 41);
	this.ball.setVelocity(1000, 400);
	this.ball.name = "BALL";
	/* var maxBalls = 1;
	//-------- Here initialize objects --------------
	for(var i=0;i < maxBalls; i++){

	this.contentList[i]= newBall;

	};
	*/

	//-----------------------------------------------

};

Game.prototype.pipeline = function() {
	var timeInterval = this.animation.getTimeInterval();
	// clear
	//this.animation.clear();
	// update
	/*Sequence is restricted!
	* Physic
	* User input
	* AIMovement
	* Collisions
	* Drawing
	* */
	//1. Physic
	//this.physic.compute();
	//1. ====================================

	//2. User Input
	this.player.moveTo(32, this.mouse.y);

	//2. ====================================

	//3. AI
	this.ball.moveAI(timeInterval);

	for(var i = 0, j = this.contentList.length; i < j; i++) {
		var test = this.collision.boxTest(this.ball, this.contentList[i]);
		if(test == 1) {
			logs(this.ball.name + ' vector(' + this.ball.vx + ',' + this.ball.vy + ')' + ' hit ' + this.contentList[i].name + ' vector(' + this.contentList[i].vx + ',' + this.contentList[i].vy + ')');
			this.physic.bounce(this.ball, this.contentList[i]);
		}
	}
	//3. ====================================

	//4. Collision
	//this.collision.hitTest(this.player,);
	//4. ====================================

	//5. Drawing ----------------------------

	// draw
	for(var i = 0, j = this.contentList.length; i < j; i++) {

		this.contentList[i].draw();

	};
	this.ball.draw();

	//5. ====================================

};
logs = function(content) {
	debugLog.appendChild(document.createTextNode(" . " + content + '\n'));
};
