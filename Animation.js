/**
 * Uwagi co do g��wnej p�tli gry w HTML5
 *
 * // 1Game != 1 CANVAS
 *
 * //Kolejno�� wykonywania obs�ugi silnika
 * function updateGame(){
 * 	processPlayerInput();
 * updateGameLogic();
 * draw();
 * setTimeout(updateGame,25);
 * }
 *
 * //
 * function draw(){
 * 	var buffer = document.createElement('canvas');
 *  var canvas = document.getElementById('visible-canvas');
 * buffer.width = canvas.width;
 * buffer.height = canvas.height;
 *
 * var buffer_ctx = buffer.getContext('2d');
 * var ctx = canvas.getContext('2d');
 *
 * //------ drawing routines -----
 * buffer_ctx.fillStyle = 'red';
 * //------ end of drawing -------
 *
 * ctx.drawImage(buffer,0,0);//copying image and instantly showing
 *
 * }
 */

var Animation = function(canvasId) {

	this.canvas = canvasId;
	this.context = this.canvas.getContext("2d");
	this.t = 0;
	this.timeInterval = 0;
	this.startTime = 0;
	this.lastTime = 0;
	this.frame = 0;
	this.animating = false;
	this.FPSvisible = false;
	this.FPS = 0;
	this.refRate = 5;
	this.FPSLimit = 0;
	this.lastDelay = 18;
	this.delay = 1;
	// provided by Paul Irish

	this.getDelay = function() {
		this.lastDelay = (1000 - (this.FPSLimit * this.timeInterval)) / this.FPSLimit;
		return this.lastDelay;
	};

	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};

	})();
};

Animation.prototype.getContext = function() {
	return this.context;
};

Animation.prototype.getCanvas = function() {
	return this.canvas;
};

Animation.prototype.clear = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Animation.prototype.setStage = function(func) {
	this.stage = func;
};

Animation.prototype.isAnimating = function() {
	return this.animating;
};

Animation.prototype.getFrame = function() {
	return this.frame;
};

Animation.prototype.start = function(_FPSLimit) {
	if(_FPSLimit < 5) {
		this.FPSLimit = 15;
	} else {
		this.FPSLimit = _FPSLimit;
	}

	var date = new Date();
	this.animating = true;

	this.startTime = date.getTime();
	this.lastTime = this.startTime;

	if(this.stage !== undefined) {
		this.stage();
	}
	this.animationLoop();
};

Animation.prototype.stop = function() {
	this.animating = false;
};

Animation.prototype.getTimeInterval = function() {
	return this.timeInterval;
};

Animation.prototype.getTime = function() {
	return this.t;
};

Animation.prototype.getFps = function() {
	this.FPS = this.timeInterval > 0 ? 1000 / this.timeInterval : 0;
	return this.FPS;
};

Animation.prototype.showFps = function(refreshRate) {
	this.FPSvisible = true;
	if(refreshRate != null) {
		this.refRate = refreshRate;
	}
};

Animation.prototype.animationLoop = function() {
	var that = this;
	var date = new Date();
	var thisTime = date.getTime();

	this.frame++;
	this.timeInterval = thisTime - this.lastTime;
	this.t += this.timeInterval;
	this.lastTime = thisTime;

	if(this.stage !== undefined) {
		this.stage();
	}

	if(this.animating) {

		var _delay =  Math.max(15, this.getDelay(this));

		//This section is responsible for displaying FPS on screen
		if(this.FPSvisible) {
			this.context.fillStyle = 'rgba(0,0,0,0.5)';
			this.context.fillRect(this.canvas.width - 250, 0, 250, 60);
			this.context.font = "18pt Calibri";
			this.context.fillStyle = "white";
			//This condition will increase performance when FPS are displaying
			if(this.getFrame() % this.refRate === 0) {

				this.context.fillText("FPS: " + this.getFps().toFixed(1) + " Frame: " + this.frame, this.canvas.width - 245, 22);
				this.context.fillText("Script time: " + _delay + " ms", this.canvas.width - 245, 44);
			} else {
				this.context.fillText("FPS: " + this.FPS.toFixed(1) + " Frame: " + this.frame, this.canvas.width - 245, 22);
				this.context.fillText("Script time: " + _delay + " ms", this.canvas.width - 245, 44);
			}
		}
		/**
		 * Setting delay for reducing resource consumption
		 */

		setTimeout(function() {
			requestAnimFrame(function() {
				that.animationLoop();
			});
		}, _delay);
	}
};
resize = function(scale) {
	var widthScaled = this.width * scale;
	var heightScaled = this.height * scale;
	var orig = ig.$new('canvas');
	orig.width = this.width;
	orig.height = this.height;
	var origCtx = orig.getContext('2d');
	origCtx.drawImage(this.data, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
	var origPixels = origCtx.getImageData(0, 0, this.width, this.height);
	var scaled = ig.$new('canvas');
	scaled.width = widthScaled;
	scaled.height = heightScaled;
	var scaledCtx = scaled.getContext('2d');
	var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);
	for(var y = 0; y < heightScaled; y++) {
		for(var x = 0; x < widthScaled; x++) {
			var index = (Math.floor(y / scale) * this.width + Math.floor(x / scale)) * 4;
			var indexScaled = (y * widthScaled + x) * 4;
			scaledPixels.data[indexScaled] = origPixels.data[index];
			scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
			scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
			scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
		}
	}
	scaledCtx.putImageData(scaledPixels, 0, 0);
	this.data = scaled;
}