var Sprite = function(_Model, _Type, _Context) {
	//This is constructor function
	this.ctx = _Context;

	this.model = new Image();
	if(_Model == undefined) {
		this.model.src = 'sprite.png';
	} else {
		this.model.src = _Model;
	}
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.name = "not_defined";
	this.model.center = {
		x : ((this.model.width * 0.5) << 0),
		y : ((this.model.height * 0.5) << 0)
	};
	this.model.x = this.x - this.model.center.x;
	this.model.y = this.y - this.model.center.y;
	this.force = {
		vx : 0,
		vy : 0
	}; this.vx = 11, // velocity px / second
	this.vy = 10, //velocity px / second
	this.lastX = this.x;
	this.lastY = this.y;
	this.mass = 0.9;
	this.slot = [];
	//Sloty na elementy doczepiane do modelu
	this.maxSlots = 4;
	//4 elementy (w tablicy 4 jest w slocie 3)
	/** Types of Non Playable Characters
	 * -1 - non collide
	 * 0 - player
	 * 1 - allie/second player
	 * 2 - environment
	 * 3 - enemy
	 * 4 - powerup
	 * 5 - bullet
	 */
	this.type = _Type;

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

Sprite.prototype.onCollide = function(object) {
	//Some sound and effects
};

Sprite.prototype.moveAI = function(timeInterval) {
	this.ctx.clearRect(this.x - this.model.center.x, this.y - this.model.center.y, this.x + this.model.width, this.y + this.model.height);

	this.lastX = this.x;
	this.lastY = this.y;
	this.x += (this.vx * timeInterval / 1000);
	this.y += (this.vy * timeInterval / 1000);

	this.model.x = this.x + this.model.center.x;
	this.model.y = this.y + this.model.center.y;
	//update center point
};

Sprite.prototype.moveTo = function(_x, _y) {
	this.ctx.clearRect(this.x, this.y, this.x + this.model.width, this.y + this.model.height);
	this.lastX = this.x;
	this.lastY = this.y;
	this.x = _x;
	this.y = _y;
	this.model.x = _x + this.model.center.x;
	this.model.y = _y + this.model.center.y;

	//this.vx = this.x - this.lastX ;
	//this.vy = this.y - this.lastY ;
};

Sprite.prototype.setCenter = function(_x, _y) {
	this.model.center.x = _x;
	this.model.center.y = _y;
	// this.model.x -=this.model.center.x;
	//this.model.y -=this.model.center.y;
};

Sprite.prototype.setVelocity = function(vx, vy) {
	this.vx = vx;
	this.vy = vy;
};

Sprite.prototype.draw = function() {

	this.ctx.drawImage(this.model, this.x - this.model.center.x, this.y - this.model.center.y);

};
