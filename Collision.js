/**
 * @author Administrator
 */
var Collision = function(_canvas, _objects/*Array*/) {
	//This is constructor function
	this.canvas = _canvas;
	this.ctx = _canvas.getContext("2d");
	this.elements = _objects;
	//Array

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
};
//Public
Collision.prototype.hitTests = function(_objects, _method) {

	_objects.forEach(function(objectA, i) {
		for(var j = i + 1; j < objects.length; j++) {
			//evaluate reference using j. For example:
			var objectB = objects[j];
			//perform collision detection between objectA and objectB
			_method;
		}
	});
};
Collision.prototype.distanceTest = function(obj1, obj2) {
	var dx = (obj2.x - obj1.x);
	var dy = (obj2.y - obj1.y);
	var dist = Math.sqrt(dx * dx + dy * dy);
	if(dist < obj1.radius + obj2.radius) {
		//handle collision
		return true;
	}
};
//Collision.prototype.wallTest = function(obj1,obj2){

//}
Collision.prototype.boxTest = function(obj1, obj2) {

	if(!(obj1.model.x + obj1.model.width > obj2.model.x)) {
		return 0;
	}
	if(!(obj1.model.x < obj2.model.x + obj2.model.width)) {
		return 0;
	}
	if(!(obj1.model.y - obj1.model.height < obj2.model.y)) {
		return 0;
	}
	if(!(obj1.model.y > obj2.model.y - obj2.model.height)) {
		return 0;
	}
	return 1;
};

//test wiele do wiele
/*
 for each(var enemy:Enemy in _enemies){
    for each(var bullet:Bullet in _bullets){
         if(bullet.x > enemy.x - enemy.width / 2 && 
            bullet.x < enemy.x + enemy.width / 2 &&
            bullet.y > enemy.y - enemy.height / 2 && 
            bullet.y < enemy.y + enemy.height / 2){
                trace("collision!");
         }
     }
}
 */

//test kolizji z kierunkiem
/*
 // collision with bricks
for(var i:int=bricks.length-1;i>=0;i--) {
	// get brick rectangle
	var brickRect:Rectangle = bricks[i].getRect(this);
	// is there a brick collision
	if (brickRect.intersects(newBallRect)) {
	// ball hitting left or right side
	if (oldBallRect.right < brickRect.left) {
	newBallX += 2*(brickRect.left - oldBallRect.right);
	ballDX *= -1;
	} else if (oldBallRect.left > brickRect.right) {
	newBallX += 2*(brickRect.right - oldBallRect.left);
	ballDX *= -1;
	}
	// ball hitting top or bottom
	if (oldBallRect.top > brickRect.bottom) {
	ballDY *= -1;
	newBallY += 2*(brickRect.bottom-newBallRect.top);
	} else if (oldBallRect.bottom < brickRect.top) {
	ballDY *= -1;
	newBallY += 2*(brickRect.top - newBallRect.bottom);
}
// remove the brick
removeChild(bricks[i]);
bricks.splice(i,1);
if (bricks.length < 1) {
endGame();
return 0;
}
}
}
// set new position
ball.x = newBallX;
ball.y = newBallY;
}
 */

/**
 * @author Joseph Lenton - PlayMyCode.com
 *
 * @param first An ImageData object from the first image we are colliding with.
 * @param x The x location of 'first'.
 * @param y The y location of 'first'.
 * @param other An ImageData object from the second image involved in the collision check.
 * @param x2 The x location of 'other'.
 * @param y2 The y location of 'other'.
 * @param isCentred True if the locations refer to the centre of 'first' and 'other', false to specify the top left corner.
 */
Collision.prototype.pixelTest = function(first, other, isCentred) {

	// we need to avoid using floats, as were doing array lookups
	var x = Math.round(first.x);
	var y = Math.round(first.y);
	var x2 = Math.round(other.x);
	var y2 = Math.round(other.y);

	var w = first.width, h = first.height, w2 = other.width, h2 = other.height;

	// deal with the image being centred
	if(isCentred) {
		// fast rounding, but positive only
		x -= (w / 2 + 0.5) << 0
		y -= (h / 2 + 0.5) << 0
		x2 -= (w2 / 2 + 0.5) << 0
		y2 -= (h2 / 2 + 0.5) << 0
	}

	// find the top left and bottom right corners of overlapping area
	var xMin = Math.max(x, x2), yMin = Math.max(y, y2), xMax = Math.min(x + w, x2 + w2), yMax = Math.min(y + h, y2 + h2);

	// Sanity collision check, we ensure that the top-left corner is both
	// above and to the left of the bottom-right corner.
	if(xMin >= xMax || yMin >= yMax) {
		return false;
	}

	var xDiff = xMax - xMin, yDiff = yMax - yMin;
	var pixels1 = first.data;
	var pixels2 = other.data;

	// if the area is really small,
	// then just perform a normal image collision check
	if(xDiff < 4 && yDiff < 4) {
		// get the pixels out from the images

		for(var pixelX = xMin; pixelX < xMax; pixelX++) {
			for(var pixelY = yMin; pixelY < yMax; pixelY++) {
				if((pixels1[((pixelX - x ) + (pixelY - y ) * w ) * 4 + 3] !== 0 ) && (pixels2[((pixelX - x2) + (pixelY - y2) * w2) * 4 + 3] !== 0 )) {
					return true;
				}
			}
		}
	} else {
		/* What is this doing?
		* It is iterating over the overlapping area,
		* across the x then y the,
		* checking if the pixels are on top of this.
		*
		* What is special is that it increments by incX or incY,
		* allowing it to quickly jump across the image in large increments
		* rather then slowly going pixel by pixel.
		*
		* This makes it more likely to find a colliding pixel early.
		*/

		// Work out the increments,
		// it's a third, but ensure we don't get a tiny
		// slither of an area for the last iteration (using fast ceil).
		var incX = xDiff / 3.0, incY = yDiff / 3.0;
		incX = (~~incX === incX) ? incX : (incX + 1 | 0);
		incY = (~~incY === incY) ? incY : (incY + 1 | 0);
		var pixels1 = first.data;
		var pixels2 = other.data;

		for(var offsetY = 0; offsetY < incY; offsetY++) {
			for(var offsetX = 0; offsetX < incX; offsetX++) {
				for(var pixelY = yMin + offsetY; pixelY < yMax; pixelY += incY) {
					for(var pixelX = xMin + offsetX; pixelX < xMax; pixelX += incX) {
						if((pixels1[((pixelX - x ) + (pixelY - y ) * w ) * 4 + 3] !== 0 ) && (pixels2[((pixelX - x2) + (pixelY - y2) * w2) * 4 + 3] !== 0 )) {
							return true;
						}
					}
				}
			}
		}
	}

	return false;
};
