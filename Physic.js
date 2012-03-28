/**
 * @author Administrator
 */

var Physic = function(Animation, Objects) {
	//This is constructor function

	//Private
	// physics globals
	this.gravity = 2000;
	// pixels / second^2
	this.collisionDamper = 0.99;
	// 80% velocity lost when collision occurs
	this.floorFriction = 100;
	// pixels / second^2
	this.timeInterval = Animation.getTimeInterval();
	this.elements = Objects;

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
Physic.prototype.compute = function() {

	for(var i = 0, j = this.elements.length; i < j; i++) {
		// gravity
		this.elements[i].vy += this.gravity * this.timeInterval / 1000;

	};
};
Physic.prototype.bounce = function(obj1, obj2) {
	logs(obj1.name + ' hit ' + obj2.name);
	//Here extract only the direction
	obj1.vx *= obj2.vx;
	obj1.vy *= obj2.vy;
	obj1.x = obj1.lastX;
	obj1.y = obj1.lastY;
};
/*

 Physic.prototype.rotate = function(_objects){
 var cos = Math.cos(vr);
 var sin = Math.sin(vr);
 _objects.forEach(function (ball) {
 var x1 = ball.x - centerX;
 var y1 = ball.y - centerY;
 var x2 = x1 * cos - y1 * sin;
 var y2 = y1 * cos + x1 * sin;
 ball.x = centerX + x2;
 ball.y = centerY + y2;
 });
 }	*/